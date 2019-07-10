import { getParams } from '../src/modules/get-params'
import * as assert from 'assert'

describe('CLI query parameters',function(){

    let params:object = {
        "0":"--query",
        "1":"size=medium",
        "2":"--query",
        "3":"size=large",
        "4":"--",
        "":"null",
        "5":"--query",
        "6":"param=something else",
        "7":"--query",
        "8":"parameter"

    }, paramsTransformed:any

    before(function(){
        // transform the query object
        paramsTransformed = getParams(params)
    })

    it('\'size\' is array.',function(){
        assert(Array.isArray(paramsTransformed.size))
    })
    it('size is array of length 2',function(){
        assert(paramsTransformed.size.length === 2)
    })
    it('param="something+else"',function(){
        assert(paramsTransformed.param == 'something else')
    })
    it('non explicitly assigned parameter',function(){
        assert(paramsTransformed.parameter === true)
    })

})