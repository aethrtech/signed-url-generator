const Bundler = require('parcel-bundler'),
{ exec } = require('pkg'),
readdirSync = require('fs').readdirSync,
package = require('../package.json'),
OUT_FILE = `${package.name}-${package.version}.js`,
{ platform, arch } = require('os'),
createInstaller = require('./build'),
rceditor = require('./rceditor'),
getBinary = require('./get-binary'),
rename = require('./rename-file'),
PKG_FETCH = 'https://api.github.com/repos/zeit/pkg-fetch/releases'
date = new Date()

let config
try {
    config = require('../.compile.json')
} catch(err){
    console.error(`\u001b[33mNo build configuration found. Proceeding with defaults.\u001b[0m`)
}

let { platforms = ['win', 'macos', 'linux'], 
archs = ['x64','x86','armv6','armv7'], 
targets = ['node', 'browser'] } = config




function build(target){
    return new Promise(function promise(resolve,reject){
        console.log(`building for target: \u001b[36m${target}\u001b[0m`)
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
    if (!targets || targets.length === 0){
        targets = [`node${process.version.match(/\d(\d)?/)[0]}`]
    }
    if (!platforms || platforms.length === 0){
        let platform
        if (process.platform === 'win32') platform = 'win'
        if (process.platform === 'osx') platform = 'macos'
        if (process.platform === 'linux') platform = 'linux'

        platforms = [platform]
    }

    for (let target of targets){

        try {
            await build(target.match(/node/) ? target.match(/node/)[0] : target)
        } catch (err){
            return cb(err)
        }
        // If targeting just the browser, we should exit now
        if (!platforms) return cb('Build complete!')
        // We need to build for node regardless, even if the user hasn't specified it.
        if (targets.find(val => val.match(/node/)) && targets.length > 1 && platforms.length !== 0){
            try {
                await build('node')
            } catch(err){
                return cb(err)
            }
        }

        for (let p of platforms){
            if (p.match(/linux|win/)){
                for (let a of archs){
                    if (p.match(/win/) && a.match(/x64|x86/) || p.match(/linux/) && a.match(/x64|armv6|armv7/)){
                        try {
                            let pkgBin = await getBinary(PKG_FETCH, p, a, target)
                            await rceditor(pkgBin)
                            await exec([`./out/src/app/index.js`,'--target',p,'--out-path',`./dist/${p}/${a}`])
                        } catch (err){
                            console.warn(`Unable to create package for ${p}-${a}.\n${err}\nSkipping...`);
                            continue
                        }
                        let files = readdirSync(`./dist/${p}/${a}`) 
                        let extension = files[0].split('.').pop()
                        try {
                            await rename(p, a,files[0],extension)
                        } catch(err){
                            console.warn(`Unable to modify executable for ${p}-${a}.\n${err}\nSkipping...`);
                            continue
                        }
                        
                        // create the release files if windows
                        if (!p.match(/win/) || process.argv.indexOf('--no-install') !== -1) continue
                        let execName = `${package.productName ? package.productName.replace(/\s/g,'') : package.name}.exe`
                        try {
                            await createInstaller(`./dist/${p}/${a}/${execName}`, execName)
                        } catch(err) {
                            console.warn(`Unable to create installer for ${p}-${a}.\n${err}\nSkipping...`);
                            continue
                        }
                    }
                }
            } else {
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
            
        }
        console.info(` build target: \u001b[36m${target}\u001b[32m complete! ✔\u001b[0m`)


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