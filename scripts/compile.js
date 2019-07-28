const Bundler = require('parcel-bundler'),
{ exec } = require('pkg'),
readdirSync = require('fs').readdirSync,
package = require('../package.json'),
OUT_FILE = `${package.name}-${package.version}.js`,
createInstaller = require('./build'),
rceditor = require('./rceditor'),
getBinary = require('./get-binary'),
rename = require('./rename-file'),
PKG_FETCH = 'https://api.github.com/repos/zeit/pkg-fetch/releases',
join = require('path').join

let config
try {
    config = require('../.compile.json')
} catch(err){
    console.error(`\u001b[33mNo build configuration found. Proceeding with defaults.\u001b[0m`)
}

let { platforms = ['win', 'macos', 'linux'], 
archs = ['x64','x86','armv6','armv7'], 
targets = ['node', 'browser'], 
nodeVersion = process.version.match(/\d+/)[0] } = config




function build(target){
    return new Promise(function promise(resolve,reject){
        let path = target === 'browser' ? './src/modules/index.ts' : './src/app/index.ts',
        bundler = new Bundler(path,{
            outDir:`./dist/${target}`,
            outFile:OUT_FILE,
            watch:false,
            cache:false,
            minify:true,
            sourceMaps:false,
            target:target,
            global: target === 'browser' ? 'SignedUrl' : false
        })

        bundler.bundle()

        bundler.on('bundled',function cb(){
            resolve()
        })

        bundler.on('error',function cb(err){
            reject(err)
        })
    })
}

async function compile(cb){
    console.log(`\u001b[36mBuild started...\u001b[0m`)
   

    if (targets && Array.isArray(targets) && targets.length !== 0 ){

        for (let target of targets){
            try {
                console.info(`Building for target: \u001b[1;36m${target}\u001b[0m`)
                await build(target.match(/node/) ? target.match(/node/)[0] : target)
            } catch (err){
                return cb(err)
            }
        }
    }

    // If targeting just the browser, we should exit now
    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) return cb('\u001b[1;32mBuild complete!\u001b[0m')

    // We need to build for node regardless, even if the user hasn't specified it.
    if (!targets){
        try {
            await build('node')
        } catch(err){
            return cb(err)
        }
    }

    for (let p of platforms){
        if (p.match(/linux|win/)){
            for (let a of archs){
                console.log(`Building for: \u001b[1;36m${p}-${a}\u001b[0m`)
                if (p.match(/win/) && a.match(/x64|x86/) || p.match(/linux/) && a.match(/x64|armv6|armv7/)){
                    try {
                        let pkgBin = await getBinary(PKG_FETCH, p, a, `node${nodeVersion}`)
                        await rceditor(pkgBin)
                        await exec([`./out/src/app/index.js`,'--target',`node${nodeVersion}-${p}-${a}`,'--out-path',`./dist/${p}/${a}`])
                    } catch (err){
                        console.warn(`\u001b[1;31mUnable to create package for ${p}-${a}.\n${err}\nSkipping...\u001b[0m`);
                        continue
                    }
                    let files = readdirSync(`./dist/${p}/${a}`) 
                    let extension = files[0].split('.').pop()
                    let execName = config.rcOptions.ProductName ? config.rcOptions.ProductName.replace(/\s/g,'') : package.name
                    let paths = {
                        oldPath: join(__dirname, '..', 'dist',p,a,files[0]),
                        newPath: join(__dirname, '..', 'dist',p,a,`${execName}.${extension}`)
                    }

                    try {
                        await rename(paths)
                    } catch(err){
                        console.warn(`\u001b[1;33mUnable to modify executable for ${p}-${a}.\n${err}\nSkipping...\u001b[0m`);
                        continue
                    }
                    
                    // create the release files if windows
                    if (!p.match(/win/) || process.argv.indexOf('--no-install') !== -1) continue
     
                    let out
                    try {
                        out = await createInstaller(`./dist/${p}/${a}/${execName}`, join(__dirname, '..','template.nuspec'), {...package,...config.rcOptions})
                        if (out) console.log(`\u001b[1;36m${out}\u001b[0m`)
                    } catch(err) {
                        console.warn(`\u001b[1;33m1Unable to create installer for ${p}-${a}.\n${err}\nSkipping...\u001b[0m`);
                        continue
                    }
                }
            }
        } else {
            console.log(`Building for: \u001b[1;36m${p}\u001b[0m`)
            try {
                await exec([`./out/src/app/index.js`,'--target',p,'--out-path',`./dist/${p}`])
            } catch (err) {
                return reject(err)
            }
            let files = readdirSync(`./dist/${p}`)
            let extension = files[0].split('.').pop() 
            // rename(platform,null,files[0],extension)
            try {
                // await rceditor( p, a, extension )
            } catch( err ){
                return reject(err)
            }
        }
        console.info(` build target: \u001b[36m${p}\u001b[32m complete! ✔\u001b[0m`)
    }
    
}

compile(function callback(err, msg){
    if (err) {
        console.error(`\u001b[31m${err}\u001b[0m`)
        process.exit(1)
    }
    console.info(`\u001b[32mBuild Complete!\u001b[0m`)
    process.exit(0)

})