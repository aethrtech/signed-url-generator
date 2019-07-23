const { resolve, dirname, basename } = require('path'),
spawn = require('child_process').spawn

const run = function(args:string[], done:Function){

    var updateExe = resolve(dirname(process.execPath), '..', 'Update.exe')
    console.log('Spawning `%s` with args `%s`', updateExe, args)
    spawn(updateExe, args, {
        detached: true
    }).on('close', done)
}

export const check = function():boolean {

    if (process.platform === 'win32') {
        var cmd = process.argv[1];
        // console.log('processing squirrel command `%s`', cmd);
        var target = basename(process.execPath);
    
        if (cmd === '--squirrel-install' || cmd === '--squirrel-updated') {
            run(['--createShortcut=' + target + ''], () => {
                return true
            });
            
        }
        if (cmd === '--squirrel-uninstall') {
            run(['--removeShortcut=' + target + ''], () => {
                return true
            });
        }
        if (cmd === '--squirrel-obsolete') {
            return true
        }
    }
    return false
}