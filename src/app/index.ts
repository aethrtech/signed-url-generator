import { generate } from '../modules/index'
import { help } from '../modules/help'
import { readFileSync } from 'fs'
import {Options } from '../../types/options'
import { getParams } from '../modules/get-params'
import { check } from '../modules/squirrel-events'
import * as pack from '../../package.json'

(async function(){

    try {
       return await import('../../.compile.json')
    } catch {
        return { ...pack, ...{ProductName : 'Signed URL Generator'}}
    }

})().then(compileOptions => {
    // First deal with squirrel arguments
    check({...compileOptions.rcOptions, ...pack}, function checked(bool){
        if (bool) return;
    
        app()

    })  
})
.catch(err => { throw new Error(err) })

function app(){

    // Retreive launch arguments. If the user types -h or --help we
    // return the available arguments.
    if (process.argv.indexOf('-h') != -1 || process.argv.indexOf('--help') != -1 || process.argv.length === 0){
        help()
        process.exit(0)
    }

    const args = {
        policy: process.argv.indexOf('--policy') != -1 ? process.argv[process.argv.indexOf('--policy') + 1] :null,
        baseUrl: process.argv[process.argv.indexOf('--base-url') + 1],
        keyPairId: process.argv[process.argv.indexOf('--key-pair-id') + 1],
        query: getParams(process.argv),
        privateKey: process.argv.indexOf('--key') != -1 ? process.argv[process.argv.indexOf('--key') + 1] : null,
        isFlash: process.argv.indexOf('--is-flash') != -1 ? true : false,
        expireTime: process.argv.indexOf('--expire-time') != -1 ? process.argv[process.argv.indexOf('--expire-time') +1] : null
    }

    // Check to see if policy and query are valid JSON objects
    let policy, query, privateKey, expireTime = args.expireTime && Number(args.expireTime) != NaN ? Number(args.expireTime) : null
    if (!args.policy){
        console.error('\u001b[31mError: Policy argument is required.\u001b[0m')
        process.exit(0)
    }
    try {
        policy = JSON.parse(args.policy)
    } catch {
        try {
            policy = JSON.parse(readFileSync(args.policy,'utf8'))
        } catch {
            console.error('Error: \u001b[31mPolicy must be a valid JSON string or a valid path to a JSON file.\u001b[0m')
            process.exit(0)
        }
    }

    if (args.query) query = args.query


    // Determine if the user wants to create a signed url using a custom or
    // canned policy. If both flags exist, the user is confused.
    if (process.argv.indexOf('--canned') != -1 && process.argv.indexOf('--custom') != -1){
        help()
        process.exit(0)
    }

    try {

        privateKey = readFileSync(args.privateKey)

    } catch {
        console.error('\u001b[31mError: Could not open private key. The path may not exist, or the file may be corrupted.\u001b[0m')
        process.exit(0)
    }

    let options:Options = { query, expireTime, isFlash:args.isFlash }

    try {

        process.argv.indexOf('--canned') != -1 ? 
        console.log(`\u001b[32m${generate(policy, args.baseUrl, args.keyPairId, privateKey, options)
        .canned()}\u001b[0m\n`) : 
        console.log(`\u001b[32m${generate(policy, args.baseUrl, args.keyPairId, privateKey, options)
        .custom()}\u001b[0m\n`)
    } catch(err){
        console.error(`\u001b[31m${err}\u001b[0m`)
    }
}