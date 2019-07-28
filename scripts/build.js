const join = require('path').join,
readFile = require('fs').readFile,
writeFile = require('fs').writeFile,
{ mkdirRecursive } = require('mkdir-recursive'),
package = require('../package.json'),
exec = require('child_process').exec,
NUGET_EXE = join(__dirname, '..', 'vendor', 'nuget', 'nuget.exe'),
date = new Date()


module.exports =  function createInstaller(source, TEMPLATE_PATH, options = {
    title: 'MyWebula Application', 
    setIcon: 'https://raw.githubusercontent.com/mywebula/signed-url-generator/alpha/resources/images/logo-3.ico?token=AHEW24D4PZTVIP7JU5JVGJK5IYSJY',
    description: 'MyWebula Node.js Application',
    authors: 'MyWebula Ltd.',
    version: '1.0.0'
}){

    const spec = join(__dirname, '..','package' ,`${package.name}.nuspec`)
    return new Promise((resolve, reject) => {
        readFile(TEMPLATE_PATH, 'utf8', async (err, data) => {
            if (err) return reject(err)
        
            data = data
            .replace('<%- name %>',options.title.replace(/\s/g,''))
            .replace('<%- title %>', options.title)
            .replace('<%- appversion %>', `${options.version}.0`)
            .replace('<%- authors %>', options.author)
            .replace('<%- description %>',options.description)
            .replace('<%- copyright %>', `${options.author}, ${date.getFullYear()}.`)
            .replace('src="<%- exe %>"',`src="${source.match(/exe/) ? source : source + '.exe'}"`)
            .replace('<%- exe %>', options.OriginalFilename.match('exe') ? options.OriginalFilename : `${options.OriginalFilename}.exe`)
            .replace('<%- icon_url %>', options.iconUrl)
            
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
                        `--releasify="${join(__dirname, '..', 'package', `${options.ProductName ? options.ProductName.replace(/\s/g,'') : options.name}.${options.version}.nupkg`)}"`,
                         `--releaseDir="${options && options.outDir ? options.outDir : source.replace(/(\\|\/)([^(\\|\/)]*$)/,'')}"`,
                         `--icon="${join(__dirname, '..', options.setIcon)}"`,
                         `--setupIcon="${join(__dirname, '..',options.setIcon)}"`,
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