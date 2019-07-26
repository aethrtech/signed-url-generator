const rename = require('fs').rename,
package = require('../package.json')

module.exports = function renameFile(platform,arch,file,extension){
    return new Promise((resolve, reject) => {
        let execName = package.productName ? package.productName.replace(/\s/g,'') : package.name
        if (extension.length >= 3 && arch){ 
            rename(`./dist/${platform}/${arch}/${file}`,`./dist/${platform}/${arch}/${execName}.${extension}`, err =>
                err ? reject(err) : resolve()       
            )
        } else if (extension.length >= 3) {
            rename(`./dist/${platform}/${file}`,`./dist/${platform}/${package.name}-${package.version}.${extension}`, err => 
            err ? reject(err) : resolve())
        } else {
            rename(`./dist/${platform}/${file}`,`./dist/${platform}/${package.name}-${package.version}`, err => 
            err ? reject(err) : resolve())
        }
    })
}