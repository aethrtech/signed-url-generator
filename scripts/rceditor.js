const exec = require('child_process').exec,
join = require('path').join,
resolve = require('path').resolve,
RCEDIT_PATH = join(__dirname, 'bin', 'rcedit.exe'),
date = new Date()

function createArgs(params){

    let args = []

    for (let param of Object.keys(params)){
        if (param.match(/setIcon|set-icon/)){
            args.push('--set-icon')
            args.push(resolve(params[param]))
            continue
        }
        args.push('--set-version-string')
        args.push(`"${param}" "${params[param]}"`)

    }

    return args
}

module. exports = function rceditor(path, options = {}){
    return new Promise((resolve, reject) => {
        let pkg, compileOptions
        try { 
            pkg = require('../package.json')
        } catch {
            console.warn(`\u001b[1;33mWarning: package.json not found!\u001b[0m`)
        }
        try {
            compileOptions = require('../.compile.json').rcOptions
        } catch {
            console.warn(`\u001b[1;33mWarning: .compile.json not found!\u001b[0m`)
        }

        if (pkg){
            if (pkg.productName) options.ProductName = pkg.productName
            if (pkg.version) options.FileVersion = `${pkg.version}.0`
            if (pkg.description) options.FileDescription = pkg.description
        }
        if (compileOptions){
            options = {...options, ...compileOptions}
        }

        if (typeof options !== 'object') return reject(`Error: Invalid arguments passed. Expecting object, received: '${typeof options}'`)
        if (Object.keys(options).length === 0) return reject(`Error: Invalid arguments passed. Expecting at least 1 parameter to be given.`)
        try {
            let args = createArgs(options)

            exec(`${RCEDIT_PATH} ${path} ${args.join(' ')}`, function execCallback(err, stderr, stdout){
                if (err || stderr) return reject(err)
                return resolve(stdout)
            })
        } catch (err){
            return reject(err)
        }
    })
}