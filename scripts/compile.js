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
execP = require('child_process').exec,
RCEDIT_PATH = join(__dirname, '..','vendor','squirrel','rcedit.exe'),
{ platform, arch } = require('os'),
date = new Date()

let config, ICON_PATH
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

try {
    ICON_PATH = package.resources.ico
} catch {
    ICON_PATH = join(__dirname, '..', 'resources', 'images', 'logo.ico')
}

let {platforms = ['win', 'macos', 'linux'], 
archs = ['x64','x86','armv6','armv7'], 
targets = ['node', 'browser'] } = config


function rceditor(plat, arc, extension ){
    return new Promise((resolve, reject) => {
        try {
            let productName = package.productName ? package.productName : package.name,
            author = package.author ? package.author : 'MyWebula Ltd.',
            description = package.description ? package.description : 'A Node.js application packaged into a binary executable.',
            originalName = extension ? `${package.name}-${package.version}.${extension}`:
            `${package.name}-${package.version}`,
            args = [
                '--set-product-version',
                `"${package.version}.0"`,
                '--set-version-string',
                `"ProductName" "${productName}"`,
                '--set-version-string',
                `"LegalCopyright" "Copyright © ${author}, ${date.getFullYear()}."`,
                '--set-version-string',
                `"FileDescription" "${description}"`,
                '--set-version-string',
                `"OriginalFilename" "${originalName}"`,
                '--set-icon',
                `"${ICON_PATH}"`
            ].join(' '),
            bin = extension ? join(__dirname, '..','dist', plat, arc, `${package.name}-${package.version}.${extension}`) :
            join(__dirname, '..','dist', plat, arc, `${package.name}-${package.version}`)
            execP(`${RCEDIT_PATH} ${bin} ${args}`, function execCallback(err, stderr, stdout){
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
    if (!targets || targets.length === 0){
        targets = ['node']
    }
    if (!platforms || platforms.length === 0){
        let platform
        if (sysPlatform === 'win32') platform = 'win'
        if (sysPlatform === 'osx') platform = 'macos'
        if (sysPlatform === linux) platform = 'linux'

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
                        await exec([`./out/src/app/index.js`,'--target',p,'--out-path',`./dist/${p}/${a}`])
                    } catch (err){
                        console.warn(`Unable to create package for ${p}-${a}. Skipping...`);
                        continue;
                    }
                    let files = readdirSync(`./dist/${p}/${a}`) 
                    let extension = files[0].split('.').pop()
                    rename(p, a,files[0],extension)
                    await rceditor( p, a, extension )
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
            rename(platform,null,files[0],extension)
            try {
                await rceditor( p, a, extension )
            } catch( err ){
                return reject(err)
            }
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