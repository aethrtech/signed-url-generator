const https = require('https'),
fs = require('fs'),
join = require('path').join,
{ mkdirRecursive } = require('mkdir-recursive'),
dir = join(__dirname,'..','vendor','nuget')

function getRelease(url, options,cb){
    https.get(url, function connect(res){

        if (res.statusCode > 300 && res.statusCode < 400 && res.headers.location){
            return getRelease(res.headers.location,options,cb)
        }
        let ws = fs.createWriteStream(join(dir,'nuget.exe'))
        res.pipe(ws)
        res.on('error', err => reject(err))
        ws.on('close', () => {
            console.log('\u001b[32mNuGet download complete!\u001b[0m')
            return cb()
        })
        res.on('error', err => cb(err))
    })
  
}



async function update(){
    console.log('Checking for updates...')
    try {
        await mkdirRecursive(dir) 
    } catch (err){
        return console.error(err)
    }
    getRelease('https://dist.nuget.org/win-x86-commandline/latest/nuget.exe',null, err => {
        if (err) return console.error(err)
    })

}

update()
