const readdir = require('fs').readdir,
join = require('path').join

module.exports = function findCached(path, platform, arch, target){
    return new Promise((resolve, reject) =>{

        if (!platform.match(/win|linux|macos|alpine|freebsd/)) return reject('Error: Unsupported platform selected.')

        let exp = new RegExp(`fetched-v${target.split('node')[1]}(.+)*-${platform}-${arch}`,'i')
        readdir(path, (err, tags) => {
            if (err) return reject(err)
            if (!tags || tags.length === 0) return reject({errcode:-4058})
            let tag = tags.reduce((current, acc) => current < acc ? acc : current , tags[0])
            readdir(join(path, tag), (err, binaries) => {

                if (err) return reject(err)

                if (!binaries || binaries.length === 0) reject({errcode:-4058})


                let pkgBin = binaries.find(bin => bin.match(exp))
                pkgBin ? resolve(pkgBin) : reject({errcode:-4058})

            })
        })
    })
}