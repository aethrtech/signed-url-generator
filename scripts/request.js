const https = require('https')

function unzipFile(path, savePath){
    return new Promise((resolve,reject) => {
        let zip = AdmZip(path)
        try {
            zip.extractAllTo(savePath,true)
        } catch(err){
            return reject(err)
        }
        resolve()
    })
}

function getRelease(obj, options,cb){
    https.get(obj.url, {options: options.headers}, function connect(res){

        if (res.statusCode > 300 && res.statusCode < 400 && res.headers.location){
            return getRelease({ url: res.headers.location,name:obj.name},options,cb)
        }
        let ws = fs.createWriteStream(join(option.savePath,obj.name))
        res.pipe(ws)
        res.on('error', err => reject(err))
        ws.on('close', async function closeSocket(){
            // wait until the write stream has actually finished.
            process.nextTick(function unzip(){
                try {
                    await unzipFile(options.zipPath)
                } catch(err){
                    return cb(err)
                }
                return cb()
            })
        })
        res.on('error', err => cb(err))
    })
  
}

const checkRelease = function checkRelease(url, options = {
    headers: {
        'User-Agent':userAgent
    }
}){
    return new Promise((resolve,reject) => {
        https.get(url, options, res => {
            let response = ''
            res.on('data', data => response += data )
            res.on('close', () => {
                try {
                        response = JSON.parse(response)
                        return resolve(response)
                } catch(err) {
                    return reject(err)
                }
            })
            res.on('error', err => { return reject(err) })
        })

    })
}

module.exports.getRelease = getRelease
module.exports.checkRelease = checkRelease