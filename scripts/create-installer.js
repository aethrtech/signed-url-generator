const exec = require('child_process').exec,
fs = require('fs'),
join = require('path').join,
format = require('util').format,
os = require('os'),
package = require('../package.json')

const NUGET_EXE = path.resolve(__dirname, '..', 'vendor', 'squirrel', 'nuget.exe');
const SYNC_RELEASES_EXE = path.resolve(__dirname, '..', 'vendor', 'squirrel', 'SyncReleases.exe');
const UPDATE_EXE = path.resolve(__dirname, '..', 'vendor', 'squirrel', 'Update.exe');
const UPDATE_COM = path.resolve(__dirname, '..', 'vendor', 'squirrel', 'Update.com');
const NUSPEC_TEMPLATE = path.resolve(__dirname, '..','..' ,'squirrel', 'template.nuspec');

function checkForExisting(){
    return new Promise((resolve,reject) => {
        fs.stat(join(__dirname,'..','dist','squirrel'), (err,stats) => {
            if (err) return resolve()

        })
    })
}
function createTempDirectory(){
    return new Promise((resolve,reject) => {
        
    })
}
function createNugetPkg(){
    return new Promise((resolve,reject) => {
        console.log('generating .nuspec file contents');
        fs.readFile(NUSPEC_TEMPLATE, function(err, buf) {
            if (err) return done(err)

            var template = _template(buf)
            var nuspecContent = template(app.serialize())


            console.log('writing nuspec file to `%s`', app.nuspec_path)
            fs.writeFile(app.nuspec_path, nuspecContent, function(err) {
                if (err) return reject(err);

                var dest = join(app.path, 'Update.exe');
                console.log(`copying '${UPDATE_EXE}' -> '${dest}'`)
                fs.copy(UPDATE_EXE, dest, function(err) {
                    if (err) return reject(err);

                    exec(NUGET_EXE, [
                    'pack',
                    app.nuspec_path,
                    '-BasePath',
                    app.path,
                    '-OutputDirectory',
                    app.nuget_out,
                    '-NoDefaultExcludes',
                    '-Version',
                    app.nupkg_version
                    ], resolve);
                })
            })
        })        
    })
}
function syncReleases(){
    return new Promise((resolve,reject) => {
        
    })
}

function createSetupExe(){
    return new Promise((resolve,reject) => {
        var args = [
            '--releasify',
            app.nupkg_path,
            '--releaseDir',
            app.out,
            '--loadingGif',
            app.loading_gif
          ];
        
          if (app.sign_with_params) {
            args.push.apply(args, ['--signWithParams', app.sign_with_params]);
          } else if (app.cert_path && app.cert_password) {
            args.push.apply(args, [
              '--signWithParams',
              format('/a /f "%s" /p "%s"', path.resolve(app.cert_path), app.cert_password)
            ]);
          }
        
          if (app.setup_icon) {
            args.push.apply(args, ['--setupIcon', path.resolve(app.setup_icon)]);
          }
        
          return exec(UPDATE_COM, args, function(err) {
            if (err) return reject(err);
            console.log(`mv '${join(app.out, 'Setup.exe')}' -> ${app.setup_path}`);
            fs.rename(path.join(app.out, 'Setup.exe'), app.setup_path, function(err) {
              if (err) return reject(err);
              resolve();
            });
          });
    })
}

module.exports = async function createInstaller(){
    try {
        await checkForExisting()
        await createTempDirectory()
        await createNugetPkg()
        await syncReleases()
        await createSetupExe()
    } catch(err){
        console.error(`\u001b[31mUnable to create installer.\n${err}\u001b[0m`)
    }


}
