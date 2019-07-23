const https = require('https'),
fs = require('fs'),
join = require('path').join,
{ mkdirRecursive } = require('mkdir-recursive'),
userAgent = 'mywebula/signed-url-generator',
package = require('../package.json'),
AdmZip = require('adm-zip'),
dir = join(__dirname,'..','vendor','squirrel')

function getRelease(obj, options,cb){
    https.get(obj.url,options, function connect(res){

        if (res.statusCode > 300 && res.statusCode < 400 && res.headers.location){
            return getRelease({ url: res.headers.location,name:obj.name},options,cb)
        }
        let ws = fs.createWriteStream(join(dir,obj.name))
        res.pipe(ws)
        res.on('error', err => reject(err))
        ws.on('close', () => {
            console.log('\u001b[32mDownload complete!\u001b[0m')
            return cb()
        })
        res.on('error', err => cb(err))
    })
  
}

function checkRelease(){
    return new Promise((resolve,reject) => {
        const options = {
            headers: {
                'User-Agent':userAgent
            }
        }

        https.get('https://api.github.com/repos/Squirrel/Squirrel.Windows/releases/latest', options, res => {
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

function unzipFile(tag){
    return new Promise((resolve,reject) => {
        console.info('\u001b[33mExtracting zip file...\u001b[0m')
        let files = fs.readdirSync(dir)
        archive = files.filter(file => file.match(/\.zip/))[0]
        try {
            let zip = AdmZip(join(__dirname,'..','vendor','squirrel',archive))
            zip.extractAllTo(dir,true)
            let files = fs.readdirSync(dir)
            archive = files.filter(file => file.match(/\.zip/))[0]
            fs.unlinkSync(join(__dirname,'..','vendor','squirrel',archive))
            package.squirrel = { tag }
            fs.writeFileSync(join(__dirname,'..','package.json'),JSON.stringify(package,null,4))
            console.info('\u001b[32mSquirrel downloaded successfully!\u001b[0m')
        } catch(err){
            return reject(err)
        }
        resolve()
    })
}

async function update(){
    console.log('Checking for updates...')
    let json
    try {
        json = await checkRelease()

    } catch (err)  {
        return console.error(`\u001b[36mError: Unable to check for the latest version of Squirrel.\n${err}\u001b[0m`)
    }


    if (package.squirrel && json.tag_name === package.squirrel.tag){
        return console.log('\u001b[36m Squirrel is already up to date. Skipping update.\u001b[0m')
    }
        

    try {

        console.info('\u001b[33mDownloading latest version of Squirrel installer...\u001b[0m')

        options = {
            headers:{
                accept:'application/octet-stream',
                'User-Agent': userAgent
            }
        }
    
        
        await mkdirRecursive(dir)
    } catch (err) {
        console.error(`\u001b[32mError: Unable to create vendor directory.\n${err}\u001b[0m`)

    }

    getRelease(json.assets[0],options, async err => {

        if (err) return console.error(`\u001b[31mError: Unable to download the latest version of Squirrel.\n${err}\u001b[0m`)

        try {
            await unzipFile(json.tag_name)
        } catch(err) {
            return console.error(`\u001b[31mError: Unable to extract the latest version of Squirrel.\n${err}\u001b[0m`)
        }
        console.log('\u001b[32mSquirrel download complete!\u001b[0m')
    })

}

update()
