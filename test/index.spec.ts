import { readFileSync } from 'fs'
import { generate } from '../src/modules/index' 
import { Policy } from '../types/policy-validate';
import * as assert from 'assert';
import * as crypto from 'crypto'

describe('Create a signed URL',function(){
    let cannedAll, 
    cannedExpireFlash,
    cannedFlash,
    cannedExpire,
    canned,
    customAll,
    customFlash,
    custom,

    options = {
        query:{
            size:'medium'
        },
        expireTime:Date.now() + 3600,
        isFlash: true
    }

    const pk:Buffer = readFileSync('./test/keys/test.pem'),
    publicKey:Buffer = readFileSync('./test/keys/p.pem'),

    reverseSanitize = function(string){
        return string.replace(/-/g,'+')
        .replace(/_/g,'=')
        .replace(/~/g,'/')
        .replace(/%20/g,' ')
        .replace(/%3F/g,'?')
        .replace(/%26/g,'&')
    },

    verify = function(url){
        let verifier = crypto.createVerify('RSA-SHA1'),
        reversed = cannedAll.
        slice(cannedAll.indexOf('Signature=') + 10, cannedAll.indexOf('Key-Pair-Id') - 1),
        
        cleaned = reverseSanitize(reversed).replace(/-/g,'+')
        .replace(/_/g,'=')
        .replace(/~/g,'/')
        .replace(/%20/g,' ')
        .replace(/%3F/g,'?')
        .replace(/%26/g,'&')

        verifier.update(JSON.stringify(policy))
        
        return verifier.verify(pk, Buffer.from(cleaned,'base64'))
    }

    let policy:Policy

    before(function(){
        policy = {
            Statement:[
                {
                    Resource:"http://www.example.com",
                    Condition:{
                        DateLessThan:{
                            'AWS:EpochTime': new Date(1985,10,26,1,20).getTime()
                        }
                    }
                }
            ]
        }

        cannedAll = generate(policy, 'https://www.example.com','AAAAAAAAAAA',pk, options).canned()
        cannedExpireFlash = generate(policy, 'https://www.example.com','AAAAAAAAAAA', pk, {expireTime:options.expireTime,isFlash:options.isFlash}).canned()
        cannedFlash = generate(policy, 'https://www.example.com','AAAAAAAAAAA',pk, {isFlash:options.isFlash}).canned()
        cannedExpire = generate(policy, 'https://www.example.com','AAAAAAAAAAA',pk, {expireTime:options.expireTime}).canned()
        canned = generate(policy, 'https://www.example.com','AAAAAAAAAAA', pk).canned()

        customAll = generate(policy, 'https://www.example.com','AAAAAAAAAAA',pk, options).custom()
        customFlash = generate(policy, 'https://www.example.com','AAAAAAAAAAA',pk, {isFlash:options.isFlash}).custom()
        custom = generate(policy, 'https://www.example.com','AAAAAAAAAAA', pk).custom()

    })
    it('Canned Policy (All)',function(){

        assert(cannedAll.match(/size=medium/gi))
        assert(cannedAll.match(/Expire/gi))
        assert(cannedAll.match(/Signature/gi))
        assert(cannedAll.match(/Key-Pair-Id/gi))
        assert(verify(cannedAll))
    })
    it('Canned Policy Expire + Flash',function(){

        assert(cannedAll.match(/Expire/gi))
        assert(cannedAll.match(/Signature/gi))
        assert(cannedAll.match(/Key-Pair-Id/gi))
        assert(verify(cannedExpireFlash))
        
    })
    it('Canned Policy + Flash',function(){

        assert(cannedAll.match(/Signature/gi))
        assert(cannedAll.match(/Key-Pair-Id/gi))
        assert(verify(cannedFlash))
        
    })
    it('Canned Policy + Expire',function(){

        assert(cannedAll.match(/Expire/gi))
        assert(cannedAll.match(/Signature/gi))
        assert(cannedAll.match(/Key-Pair-Id/gi))

        assert(verify(cannedExpire))
        
    })
    it('Canned None',function(){

        assert(cannedAll.match(/Signature/gi))
        assert(cannedAll.match(/Key-Pair-Id/gi))
        assert(verify(canned))
    })
    it('Custom Policy (All)',function(){

        assert(customAll.match(/size=medium/gi))
        assert(customAll.match(/Signature/gi))
        assert(customAll.match(/Key-Pair-Id/gi))
        assert(verify(customAll))
        
    })
    it('Custom Policy',function(){

        assert(custom.match(/Policy/gi))
        assert(custom.match(/Signature/gi))
        assert(custom.match(/Key-Pair-Id/gi))
        assert(verify(custom))
        
    })
    it('Custom Policy + Flash',function(){
        
        assert(customFlash.match(/Policy/gi))
        assert(customFlash.match(/Signature/gi))
        assert(customFlash.match(/Key-Pair-Id/gi))

        assert(verify(customFlash))

    })
    
    
 })