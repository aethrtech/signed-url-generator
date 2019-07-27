const join = require('path').join,
readFile = require('fs').readFile,
writeFile = require('fs').writeFile,
{ mkdirRecursive } = require('mkdir-recursive'),
package = require('../package.json'),
exec = require('child_process').exec,
NUGET_EXE = join(__dirname, '..', 'vendor', 'nuget', 'nuget.exe'),
TEMPLATE_PATH = join(__dirname, '..','template.nuspec'),
date = new Date()


module.exports =  function createInstaller(source, exeName, options){
    const spec = join(__dirname, '..','package' ,`${package.name}.nuspec`)
    return new Promise((resolve, reject) => {
        readFile(TEMPLATE_PATH, 'utf8', async (err, data) => {
            if (err) return reject(err)
        
            data = data
            .replace('<%- name %>',package.title.replace(/\s/g,''))
            .replace('<%- title %>', package.title)
            .replace('<%- appversion %>', `${package.version}.0`)
            .replace('<%- authors %>', package.author)
            .replace('<%- description %>',package.description)
            .replace('<%- copyright %>', `${package.author}, ${date.getFullYear()}`)
            .replace('src="<%- exe %>"',`src="${source}"`)
            .replace('<%- exe %>', exeName.match('exe') ? exeName : `${execName}.exe`)
            .replace('<%- icon_url %>', `https://raw.githubusercontent.com/mywebula/signed-url-generator/alpha/resources/images/logo.ico?token=AHEW24FGECZGETJEGGZFB4C5IGL6C`)
            
            try {
                await mkdirRecursive(join(__dirname, '..','package'))
            } catch (err){
                return reject(err)
            }
            writeFile(spec, data, 'utf8', err => {
                if (err) return reject(err)

                exec(`${NUGET_EXE} pack ${spec} -BasePath ${join(__dirname, '..')} -OutputDirectory ${join(__dirname, '..', 'package')}`, (err, stdout, stderr) => {
                    if (err) return reject(err)
                    if (stderr) return reject(stderr)
                    console.log(`\u001b[32m${stdout}\u001b[0m`)

                    let args = [
                        `--releasify="${join(__dirname, '..', 'package', `${package.productName ? package.productName.replace(/\s/g,'') : package.name}.${package.version}.nupkg`)}"`,
                         `--releaseDir="${options && options.outDir ? options.outDir : source.replace(/(\\|\/)([^(\\|\/)]*$)/,'')}"`,
                         `--icon="${join(__dirname, '..', 'resources', 'images', 'logo.ico')}"`,
                         `--setupIcon="${join(__dirname, '..', 'resources', 'images', 'logo.ico')}"`,
                         `--bootstrapperExe="${join(__dirname, '..', 'vendor', 'squirrel', 'setup.exe')}`

                    ]

                    if (options.sign){
                        args.push(`-n "/a /f ${join(__dirname, '..', '.cert', 'cert.pfx')} ${ options.sign.password ? '/p' + options.sign.password : ''} /fd sha256 /tr http://timestamp.digicert.com /td sha256"`)
                    }

                    exec(`${join(__dirname,'..','vendor','squirrel','squirrel.com')} ${args}`, (err, stdout,stderr) => {
                        if (err) return reject(err)
                        if (stderr && stderr !== '\r\n') return reject(stderr)
                        return resolve(stdout)
                    })
                })
            })
        })
    })
}