const exec = require('child_process').exec,
RCEDIT_PATH = join(__dirname, '..','vendor','squirrel','rcedit.exe'),
package = require('../package.json'),
join = require('path').join

try {
    ICON_PATH = package.resources.ico
} catch {
    ICON_PATH = join(__dirname, '..', 'resources', 'images', 'logo.ico')
}

module. exports = function rceditor(path){
    return new Promise((resolve, reject) => {
        try {
            let productName = package.productName ? package.productName : package.name,
            author = package.author ? package.author : 'MyWebula Ltd.',
            description = package.description ? package.description : 'A Node.js application packaged into a binary executable.',
            originalName = extension ? `${package.name}-${package.version}.${extension}`:
            `${package.name}-${package.version}`,
            args = [
                '--set-version-string', 
                `"ProductName" "${productName}"`,
                '--set-version-string',
                `"LegalCopyright" "Copyright © ${author}, ${date.getFullYear()}."`,
                '--set-version-string',
                `"FileDescription" "${description}"`,
                '--set-version-string',
                `"OriginalFilename" "${originalName}"`,
                '--set-icon',
                `"${ICON_PATH}"`,
                '--set-version-string',
                'SquirrelAwareVersion 1'
            ].join(' ')

            exec(`${RCEDIT_PATH} ${path} ${args}`, function execCallback(err, stderr, stdout){
                if (err || stderr) return reject(err)
                return resolve(stdout)
            })
        } catch (err){
            return reject(err)
        }
    })
}