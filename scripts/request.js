const https = require('https'),
createWriteStream = require('fs').createWriteStream,
join = require('path').join,
fs = require('fs')



function getRelease(obj, options, cb){
    savePath = join(options.saveDir,obj.name)
    let ws = createWriteStream(savePath)
    https.get(obj.url, {headers: options.headers}, function connect(res){

        if (res.statusCode > 300 && res.statusCode < 400 && res.headers.location)return getRelease({ url: res.headers.location,name:obj.name},options,cb)
        if (res.statusCode > 300) return cb({statusCode:res.statusCode, statusMessage:res.statusMessage})
        res.pipe(ws)
        res.on('error', err => reject(err))
        ws.on('close', async function closeSocket(){
    
            fs.access(savePath,err => {
                if (err) console.log(err)
                return cb(null,savePath)
            })
        })
        res.on('error', err => { ws.close(); cb(err)})
    })
  
}

const checkRelease = function checkRelease(url, options){
    return new Promise((resolve,reject) => {
        https.get(url, options, res => {
            let response = ''
            res.on('data', data => response += data )
            res.on('close', () => {
                try {
                    response = JSON.parse(response.toString())
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