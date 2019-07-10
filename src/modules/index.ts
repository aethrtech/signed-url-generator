import * as crypto from 'crypto'
import { safeUrlChars } from './safe-url-chars'
import { policyValidate } from './policy-validate'
import { Policy } from '../../types/policy-validate'
import { wwwUrlEncode } from './www-url-encode'
import { Options } from '../../types/options'

export const generate = function create(policy: Policy | object, baseURL:string, keyPairId:string, privateKey:Buffer, options?:Options){
    
    let base64policy:string,
    base64signature:string,
    encodedURIComponent:string,
    sign:any = crypto.createSign('RSA-SHA1')
    

    if (options && options.query){
    
        try {
            encodedURIComponent = wwwUrlEncode(options.query)
        } catch(err){
            throw new Error('\u001b[32mError: Query JSON is malformed.\u001b[0m')
        }
    }
    base64policy = Buffer.from(JSON.stringify(policy)).toString('base64')

    return {
        canned:function(){
            policyValidate(policy)

            sign.update((JSON.stringify(policy)))

            base64signature = safeUrlChars(sign.sign(privateKey,'base64').toString())
            base64policy = safeUrlChars(Buffer.from(JSON.stringify(policy)).toString('base64'),options ? options.isFlash: null)
            
            if (encodedURIComponent && options && options.expireTime) return `${baseURL}?${encodedURIComponent}&Expire=${options.expireTime}&Signature=${base64signature}&Key-Pair-Id=${keyPairId}`
            if (encodedURIComponent) return `${baseURL}?${encodedURIComponent}&Signature=${base64signature}&Key-Pair-Id=${keyPairId}`
            if (options && options.expireTime) return `${baseURL}?${options.expireTime}&Signature=${base64signature}&Key-Pair-Id=${keyPairId}`
            return `${baseURL}?Signature=${base64signature}&Key-Pair-Id=${keyPairId}`
        },
        custom:function(){

            policyValidate(policy)

            sign.update((JSON.stringify(policy)))

            base64signature = safeUrlChars(sign.sign(privateKey,'base64').toString())
            base64policy = safeUrlChars(Buffer.from(JSON.stringify(policy)).toString('base64'),options ? options.isFlash: null)

            if (encodedURIComponent) return `${baseURL}?${encodedURIComponent}&Policy=${base64policy}&Signature=${base64signature}&Key-Pair-Id=${keyPairId}`
            return `${baseURL}?Policy=${base64policy}&Signature=${base64signature}&Key-Pair-Id=${keyPairId}`
        }
    }
}
