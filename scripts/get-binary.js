const join = require('path').join,
request = require('./request'),
homedir = require('os').homedir,
findCached = require('./find-cached'),
mkdirRecursive = require('mkdir-recursive').mkdirRecursive,
rename = require('fs').rename,
unlink = require('fs').unlink,
package = require('../package.json')

function getBinary(url, platform, arch, target){
    return new Promise(async (resolve,reject)=> {

        let PKG_PATH = join(homedir(), '.pkg-cache')

        try {
            return await findCached(PKG_PATH, platform, arch, target)
        } catch(err){
            if (err.errcode !== -4058) return reject(err)
            if (err.errcode === -4058) console.warn('Warning: Unable to retrieve cached packages. Proceeding to download...')
        }

        // Binary not found, so download it.
        let list, data, options = {
            headers: {
                'User-Agent':`mywebula/${package.name}`
            }   
        }

        try {
            list = await request.checkRelease(url, options)
        } catch (err){
            return reject(`Error: Unable to retrieve pkg binaries.\n${err}`)
        }

        // Find the asset we're interested in
        let exp, asset, tag
        if (target) {
            exp = new RegExp(`(node-v${target.split('node')[1]}).+(${platform})-${arch}`,'i')
            list.find((items) => {
                return items.assets.find(item => {
                    if (item.name.match(exp)){
                        asset = item
                        tag = items.name
                        return true
                    }
                })
            })
            
        } else {
            exp = new RegExp(`${platform}-${arch}`,'i')
            
            .find( asset => asset.name.match(exp))
        }

        if (!asset) return reject(`Unable to find pkg for ${target}-${platform}-${arch}`)

        // Download
        options.headers.accept = asset.content_type
        options.saveDir = join(process.cwd(), 'temp')

        //rename the file to match that of pkg's own style
        asset.name = asset.name.replace(/v(.+)-v/,'v')
        .replace('uploaded','fetched')
        request.getRelease(asset, options,async (err, path) => {
            if (err) return reject(`Error: Unable to download or extract base binary.\n${err}`)
            
            // File now saved. Move it to .pkg-cache
            try {
                await mkdirRecursive(join(homedir(), '.pkg-cache'), tag)
            } catch(err){
                return reject(`Error: Unable to create .pkg-cache manually. ${err}`)
            }

            // copy to .pkg-cache
            rename(path, join(PKG_PATH, tag, asset.name), err => {
                if (err) return reject(err)
                return resolve(join(PKG_PATH, tag, asset.name))
            })
        })
    })
}