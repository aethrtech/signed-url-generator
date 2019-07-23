const package = require('../package.json'),
exec = require('child_process').exec,
join = require('path').join
NUGET_EXE = join(__dirname, '..', 'vendor', 'nuget', 'nuget.exe'),
TEMPLATE_PATH = join(__dirname, '..','template.nuspec'),
fs = require('fs'),
date = new Date()

// Append project.json values to template
fs.readFile(TEMPLATE_PATH, 'utf8', (err, data) => {
    if (err) return console.error(err)

    data = data
    .replace('<%- name %>',package.name.replace(/-/g,''))
    .replace('<%- title %>', package.title)
    .replace('<%- appversion %>', `${package.version}.0`)
    .replace('<%- authors %>', package.author)
    .replace('<%- description %>',package.description)
    .replace('<%- copyright %>', `© ${package.author}, ${date.getFullYear()}`)
    .replace('src="<%- exe %>"',`src="dist\\win\\x64\\${package.name}-${package.version}.exe"`)
    .replace('<%- exe %>',`${package.name}-${package.version}.exe`)

    fs.writeFile(join(__dirname, '..','package' ,'test.nuspec'), data, 'utf8', err => {
        if (err) return console.log(err)

        exec(`${NUGET_EXE} pack ${join(__dirname, '..', 'package', 'test.nuspec')} -BasePath ${join(__dirname, '..')} -OutputDirectory ${join(__dirname, '..', 'package')}`, (err, stdout, stderr) => {
            if (err) return console.error(err)
            if (stderr) return console.error(stderr)
            console.log(`\u001b[32m${stdout}\u001b[0m`)

        })
    })
    
})