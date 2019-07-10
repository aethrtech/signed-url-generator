const join = require('path').join,
Bundler = require('parcel-bundler'),
{ exec } = require('pkg'),
platforms = ['linux','macos','win'],
archs = ['x64','x86','armv6','armv7'],
readFileSync = require('fs').readFileSync,
renameSync = require('fs').renameSync,
readdirSync = require('fs').readdirSync,
package = JSON.parse(readFileSync('./package.json','utf8'))

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
        let path = target === 'browser' ? './src/modules/index.ts' : './src/app/index.ts',
        bundler = new Bundler(path,{
            outDir:`./dist/${target}`,
            outFile:`${package.name}-${package.version}.js`,
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

async function run(){
    let targets
    try {
        targets = JSON.parse(readFileSync('./.compilerc','utf8')).targets
    } catch(err){
        console.warn('\u001b[43mNo compile configuration parsed or deteced. Using default settings.\u001b[0m')
        targets = ['node','browser']
    }
    for (let target of targets){
        await build(target)
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
        }
        

    }



}

run()