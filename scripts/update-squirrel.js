const OctoKit = require('@octokit/rest'),
octokit = new OctoKit,
https = require('https'),
fs = require('fs'),
join = require('path').join,
{ mkdirRecursive } = require('mkdir-recursive'),
EventEmitter = require('events').EventEmitter,
emitter = new EventEmitter()


function request(url, options){
    https.get(url,options, function connect(res){

        if (res.statusCode > 300 && res.statusCode < 400 && res.headers.location){
            return emitter.emit('redirect', res.headers.location)
        }

        res.on('data', data => emitter.emit('data',data))
        res.on('error', data => emitter.emit('error',data))
        

    })
            
}

async function update(){
    let json
    try {
        json = await octokit.repos.getLatestRelease({
            owner:'Squirrel',
            repo: 'Squirrel.Windows'
        })

        let dir = join(__dirname,'..','vendor','squirrel'),
        options = {
            headers:{
                accept:'application/octet-stream',
                'User-Agent': 'curl/7.37.0'
            }
        }
    


        await mkdirRecursive(dir)

        let ws = fs.createWriteStream(join(dir,json.data.assets[0].name))

        request(json.data.assets[0].url,options)

        emitter.on('redirect', url => request(url,options))

        emitter.on('data', data => ws.write(data))        


    } catch(err){
        console.error(`\u001b[31mError: Unable do download the latest latest version of Squirrel.\n${err}\u001b[0m`)
    }
}

update()