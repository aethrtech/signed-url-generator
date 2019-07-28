const rename = require('fs').rename

module.exports = function renameFile({ oldPath, newPath }){
    return new Promise((resolve, reject) => {
        rename(oldPath, newPath, err => {
            return err ? reject(err) : resolve()
        })
        
    })
}