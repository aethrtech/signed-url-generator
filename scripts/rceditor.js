const exec = require('child_process').exec,
join = require('path').join
ICON_PATH = join(__dirname, '..', 'resources', 'images', 'logo.ico'),
RCEDIT_PATH = join(__dirname, 'bin', 'rcedit.exe'),
package = require('../package.json'),
date = new Date()


function createArgs(params){

    let args = []

    for (let param in params){
        args.push('--set-version-string')
        args.push(`"${param}" "${params[param]}"`)

    }

    return args
}

module. exports = function rceditor(path, options){
    return new Promise((resolve, reject) => {

        
        try {
            let productName = package.productName ? package.productName : package.name,
            author = package.author ? package.author : 'MyWebula Ltd.',
            description = package.description ? package.description : 'A Node.js application packaged into a binary executable.',
            extension = path.match(/win/) ? '.exe' : '',
            originalName = extension ? `${package.name}-${package.version}.${extension}`:
            `${package.name}-${package.version}`
            if (options && options.resources){
                try {
                    args = createArgs(options.resources)
                } catch(err){
                    return reject(err)
                }
            } else {
                args = [
                    '--set-version-string', 
                    `"ProductName" "${productName}"`,
                    '--set-version-string',
                    `"ProductVersion" "${package.version}"`,
                    '--set-version-string',
                    `"FileVersion" "${package.version}.0"`,
                    '--set-version-string',
                    `"LegalCopyright" "Copyright © ${author}, ${date.getFullYear()}"`,
                    '--set-version-string',
                    `"FileDescription" "${description}"`,
                    '--set-version-string',
                    `"OriginalFilename" "${productName.replace(/\s/g,'')}${extension ? extension : ''}"`,
                    '--set-icon',
                    `"${ICON_PATH}"`,
                    '--set-version-string',
                    '"SquirrelAwareVersion" "1"'
                ].join(' ')
            }

            exec(`${RCEDIT_PATH} ${path} ${args}`, function execCallback(err, stderr, stdout){
                if (err || stderr) return reject(err)
                return resolve(stdout)
            })
        } catch (err){
            return reject(err)
        }
    })
}