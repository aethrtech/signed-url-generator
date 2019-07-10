import * as assert from 'assert'
import {safeUrlChars } from '../src/modules/safe-url-chars'

describe('Checking for safe url replacement',function(){
    it('Replace "+"',function(){
        assert(safeUrlChars('+') === '-')
    })
    it('Replace "="',function(){
        assert(safeUrlChars('=') === '_')
    })
    it('Replace "/"',function(){
        assert(safeUrlChars('/') === '~')
    })
    it('Replace " "',function(){
        assert(safeUrlChars(' ') === '%20')
    })
    it('Replace "?"',function(){
        assert(safeUrlChars('?',true) === '%3F')
    })
    it('Replace "&"',function(){
        assert(safeUrlChars('&',true) === '%26')
    })
})