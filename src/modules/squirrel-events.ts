import { resolve, dirname, basename } from 'path'
import { spawn } from 'child_process'
import { join } from 'path'
import { homedir } from 'os'

const run = function(args:string[], done:Function){

    var updateExe = resolve(dirname(process.execPath), '..', 'Update.exe')
    console.log('Spawning `%s` with args `%s`', updateExe, args)

    spawn(updateExe, args, {
        detached: true
    }).on('close', () => done())
    .on('error', err => done(err))
}

export const check = function({ProductName, version}:any , cb:Function):boolean {

    if (process.platform === 'win32') {
        let cmd = process.argv.find(arg => arg.match(/--squirrel/));
        if (!cmd) return cb(false)
        console.log('processing squirrel command `%s`', cmd);
        let exe = basename(process.execPath)
        let target = join(homedir(),'AppData','Local',ProductName.replace(/\s/g, ''),`app-${version}`, exe)
    
        if (cmd.match(/--squirrel-install|--squirrel-updated/i)) {
            run(['--createShortcut=' + target + ''], err => {
                return cb(err, true)
            });
            
        }
        if (cmd.match(/--squirrel-uninstall/i)) {
            run(['--removeShortcut=' + target + ''], err => {
                return cb(err, true)
            });
            
        }
        if (cmd === '--squirrel-obsolete') {
            return cb(true)
        }
    } else {
        return cb(false)
    }
}