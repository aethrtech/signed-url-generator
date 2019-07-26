const Bundler = require('parcel-bundler'),
{ exec } = require('pkg'),
renameSync = require('fs').renameSync,
readdirSync = require('fs').readdirSync,
package = require('../package.json'),
OUT_FILE = `${package.name}-${package.version}.js`,
{ platform, arch } = require('os'),
createInstaller = require('./build'),

homedir = require('os').homedir,
rename = require('fs').rename,
rceditor = require('./rceditor'),
getBinary = require('./get-binary'),
PKG_FETCH = 'https://api.github.com/repos/zeit/pkg-fetch/releases/latest'
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


function rename(platform,arch,file,extension){
    if (extension.length >= 3 && arch){ 
        renameSync(`./dist/${platform}/${arch}/${file}`,`./dist/${platform}/${arch}/${package.name}-${package.version}.${extension}`)
    } else if (extension.length >= 3) {
        renameSync(`./dist/${platform}/${file}`,`./dist/${platform}/${package.name}-${package.version}.${extension}`)
    } else {
        renameSync(`./dist/${platform}/${file}`,`./dist/${platform}/${package.name}-${package.version}`)
    }
}

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
        targets = ['node']
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
            await build(target)
        } catch (err){
            return cb(err)
        }
        console.info(` build target: \u001b[36m${target}\u001b[32m complete! ✔\u001b[0m`)
    }

    // If targeting just the browser, we should exit now
    if (!platforms) return cb('Build complete!')
    // We need to build for node regardless, even if the user hasn't specified it.
    if (targets.indexOf('node') === -1 && target.length > 1 && platforms.length !== 0){
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
                        let pkgBin = await getBinary(PKG_FETCH, platform, arch, target)
                        await rceditor(pkgBin)
                        await exec([`./out/src/app/index.js`,'--target',p,'--out-path',`./dist/${p}/${a}`])
                    } catch (err){
                        console.warn(`Unable to create package for ${p}-${a}.\n${err}\nSkipping...`);
                        continue
                    }
                    let files = readdirSync(`./dist/${p}/${a}`) 
                    let extension = files[0].split('.').pop()
                    try {
                        // rename(p, a,files[0],extension)
                        // await rceditor( p, a, extension )
                    } catch(err){
                        console.warn(`Unable to modify executable for ${p}-${a}.\n${err}\nSkipping...`);
                        continue
                    }
                    
                    // create the release files if windows
                    if (!p.match(/win/) || process.argv.indexOf('--no-install') !== -1) continue
                    try {
                        await createInstaller(p, a )
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



}

compile(function callback(err, msg){
    if (err) {
        console.error(`\u001b[31m${err}\u001b[0m`)
        process.exit(1)
    }
    console.info(`\u001b[32mBuild Complete!\u001b[0m`)
    process.exit(0)

})