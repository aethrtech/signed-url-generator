const join = require('path').join,
readFile = require('fs').readFile,
writeFile = require('fs').writeFile,
{ mkdirRecursive } = require('mkdir-recursive'),
package = require('../package.json'),
exec = require('child_process').exec,
NUGET_EXE = join(__dirname, '..', 'vendor', 'nuget', 'nuget.exe'),
TEMPLATE_PATH = join(__dirname, '..','template.nuspec'),
resolve = require('path').resolve,
date = new Date()


module.exports =  function createInstaller(source, exeName, options){

    let compileOptions, pkg
    try {
        compileOptions = require('../.compile.json')
    pkg = {...package, ...compileOptions.rcOptions}
    } catch {
        compileOptions = {
            title: 'MyWebula Application', 
    setIcon: 'https://raw.githubusercontent.com/mywebula/signed-url-generator/alpha/resources/images/logo-3.ico?token=AHEW24D4PZTVIP7JU5JVGJK5IYSJY'}
        pkg = {...package, ...compileOptions}
    }

    const spec = join(__dirname, '..','package' ,`${package.name}.nuspec`)
    return new Promise((resolve, reject) => {
        readFile(TEMPLATE_PATH, 'utf8', async (err, data) => {
            if (err) return reject(err)
        
            data = data
            .replace('<%- name %>',pkg.title.replace(/\s/g,''))
            .replace('<%- title %>', pkg.title)
            .replace('<%- appversion %>', `${pkg.version}.0`)
            .replace('<%- authors %>', pkg.author)
            .replace('<%- description %>',pkg.description)
            .replace('<%- copyright %>', `${pkg.author}, ${date.getFullYear()}.`)
            .replace('src="<%- exe %>"',`src="${source}"`)
            .replace('<%- exe %>', exeName.match('exe') ? exeName : `${execName}.exe`)
            .replace('<%- icon_url %>', pkg.iconUrl)
            
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
                        `--releasify="${join(__dirname, '..', 'package', `${pkg.ProductName ? pkg.ProductName.replace(/\s/g,'') : pkg.name}.${pkg.version}.nupkg`)}"`,
                         `--releaseDir="${options && options.outDir ? options.outDir : source.replace(/(\\|\/)([^(\\|\/)]*$)/,'')}"`,
                         `--icon="${join(__dirname, '..', pkg.setIcon)}"`,
                         `--setupIcon="${join(__dirname, '..',pkg.setIcon)}"`,
                         `--bootstrapperExe="${join(__dirname, '..', 'vendor', 'squirrel', 'setup.exe')}`

                    ]

                    if (options.sign){
                        args.push(`-n '/a /f ${join(__dirname, '..', '.cert', 'cert.pfx')} ${ options.sign.password ? '/p "' + options.sign.password : ''}" /fd sha256 /tr http://timestamp.digicert.com /td sha256`)
                    }

                    args = args.join(' ')

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