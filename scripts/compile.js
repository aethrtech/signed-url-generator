const join = require('path').join,
Bundler = require('parcel-bundler'),
{ exec } = require('pkg'),
readFile = require('fs').readFile,
writeFile = require('fs').writeFile,
renameSync = require('fs').renameSync,
readdirSync = require('fs').readdirSync,
{ mkdirRecursive } = require('mkdir-recursive'),
package = require('../package.json'),
OUT_FILE = `${package.name}-${package.version}.js`,
{ execP = exec } = require('child_process'),
date = new Date()

let config
try {
    config = require('../.compile.json')
} catch(err){
    console.error(`\u001b[33mNo build configuration found. Proceeding with defaults.\u001b[0m`)
    config = {
        targets: ['node','browser'],
        platforms:['x64','x86','armv6','armv7'],
        archs:['x64','x86','armv6','armv7']
    }
}

let {platforms = ['x64','x86','armv6','armv7'], 
archs = ['x64','x86','armv6','armv7'], 
targets = ['node', 'browser'] } = config


function rceditor({ extension }){
    return new Promise((resolve, reject) => {
        try {
            let RCEDIT_PATH = join(__dirname, '..', 'vendor', 'rcedit', 'rcedit'),
            productName = package.productName ? package.productName : package.name,
            author = package.author ? package.author : 'MyWebula Ltd.',
            description = package.description ? package.description : 'A Node.js application packaged into a binary executable.',
            originalName = `${package.name}.${extension}`,
            args = [
                '--set-product-version',
                `${package.version}.0`,
                '--set-version-string',
                `"ProductName" "${productName}"`,
                '--set-version-string',
                `"LegalCopyright" "Copyright © ${author}"`,
                '--set-version-string',
                `"FileDescription" "${description}"`,
                '--set-version-string',
                `"OriginalFilename" ${originalName}`,
                '--set-icon',
                `${iconPath}`
            ].join(' ')
            execP(`${RCEDIT_PATH} ${args}`, function execCallback(err, stderr, stdout){
                if (err || stderr) return reject(err)
                return resolve(stdout)
            })
        } catch (err){
            return reject(err)
        }
    })
}

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
            global: target === 'browser' ? 'CreateSignedUrl' : false
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

async function run(cb){
    console.log(`\u001b[36mBuild started...\u001b[0m`)

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

    for (let platform of platforms){
        if (platform.match(/linux|win/)){
            for (let arch of archs){
                if (platform.match(/win/) && arch.match(/x64|x86/) || platform.match(/linux/) && arch.match(/x64|armv6|armv7/)){
                    await exec([`./out/src/app/index.js`,'--target',platform,'--out-path',`./dist/${platform}/${arch}`])
                    let files = readdirSync(`./dist/${platform}/${arch}`) 
                    let extension = files[0].split('.').pop()
                    rename(platform, arch,files[0],extension)
                }
            }
        } else {
            await exec([`./out/src/app/index.js`,'--target',platform,'--out-path',`./dist/${platform}`])
            let files = readdirSync(`./dist/${platform}`)
            let extension = files[0].split('.').pop() 
            rename(platform,null,files[0],extension)
            await rceditor({ extension })
        }
        
    }



}

run(function callback(err, msg){
    if (err) {
        console.error(`\u001b[31m${err}\u001b[0m`)
        process.exit(1)
    }
    console.info(`\u001b[32mBuild Complete!\u001b[0m`)
    process.exit(0)

})