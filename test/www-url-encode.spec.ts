import { wwwUrlEncode } from '../src/modules/www-url-encode'
import * as assert from 'assert'

describe('Creating x-www-url-endcoded parameters',function(){
    let encoded
    before(function(){
        let query = {
            a:true,
            b:'string',
            c:0,
            d:['one','two'],
            e:['one two']
        }

        encoded = wwwUrlEncode(query)
    })
    it('query string: a=true',function(){
        assert(encoded.match(/a=true/gi))
    })
    it('query string: b=string',function(){
        assert(encoded.match(/b=string/gi))
    })
    it('query string: c=0',function(){
        assert(encoded.match(/c=0/gi))
    })
    it('query string:d=one&d=two',function(){
        assert(encoded.match(/d=one&d=two/gi))
    })
    it('query string:e=one+two',function(){
        assert(encoded.match(/e=one\+two/gi))
    })
})