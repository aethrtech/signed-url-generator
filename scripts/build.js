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
NUGET_EXE = join(__dirname, '..', 'vendor', 'nuget', 'nuget.exe'),
TEMPLATE_PATH = join(__dirname, '..','template.nuspec'),
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

function createInstaller(){
    return new Promise((resolve,reject) => {
        readFile(TEMPLATE_PATH, 'utf8', async (err, data) => {
            if (err) return reject(err)
        
            data = data
            .replace('<%- name %>',package.name.replace(/-/g,''))
            .replace('<%- title %>', package.title)
            .replace('<%- appversion %>', `${package.version}.0`)
            .replace('<%- authors %>', package.author)
            .replace('<%- description %>',package.description)
            .replace('<%- copyright %>', `© ${package.author}, ${date.getFullYear()}`)
            .replace('src="<%- exe %>"',`src="dist\\win\\x64\\${package.name}-${package.version}.exe"`)
            .replace('<%- exe %>',`${package.name}-${package.version}.exe`)
            
            try {
                await mkdirRecursive(join(__dirname, '..','package'))
            } catch (err){
                return reject(err)
            }
            writeFile(join(__dirname, '..','package' ,'test.nuspec'), data, 'utf8', err => {
                if (err) return reject(err)
        
                execP(`${NUGET_EXE} pack ${join(__dirname, '..', 'package', 'test.nuspec')} -BasePath ${join(__dirname, '..')} -OutputDirectory ${join(__dirname, '..', 'package')}`, (err, stdout, stderr) => {
                    if (err) return reject(err)
                    if (stderr) return reject(stderr)
                    console.log(`\u001b[32m${stdout}\u001b[0m`)

                    execP(`${join(__dirname,'..','vendor','squirrel','squirrel.com')} --releasify ${join(__dirname, '..', 'package', package.name.replace(/-/g,''))}.${package.version}.nupkg`, (err, stderr,stdout) => {
                        if (err) return reject(err)
                        if (stderr && stderr !== '\r\n') return reject(stderr)
                        return resolve(stdout)
                    })
                })
            })
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
        }
        
    }

    let msg
    if (platforms.includes('win')){
        console.log('\u001b[36mCreating Windows Installer...\u001b[0m')
        try {
            msg = await createInstaller()
        } catch (err) {
            return cb(err)
        }

    }
    // The node build may need to be deleted if it was explicitly omitted
    if (targets.indexOf('node') === -1 && target.length > 1 && platforms.length !== 0){
        fs.unlink(`../dist/node/${OUT_FILE}`, err => {
            if (err) return cb(err)
            return cb(null,msg)
        })
    } else {
        return cb(null,msg)
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