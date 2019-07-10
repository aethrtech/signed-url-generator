const Bundler = require('parcel-bundler')

function compile(){
    return new Promise(function promise(resolve,reject){
        let path =  './src/app/index.ts',
        bundler = new Bundler(path,{
            outDir:`./build`,
            outFile:`index.js`,
            watch:false,
            cache:false,
            minify:false,
            sourceMaps:true,
            target:'node',
        })

        bundler.bundle()

        bundler.on('bundled',function cb(){
            resolve()
        })

        bundler.on('error',function cb(err){
            reject(err)
        })
    })
}

compile()