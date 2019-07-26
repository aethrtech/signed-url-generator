import * as getBinary from '../../scripts/get-binary'
import  * as assert from 'assert'
import { join } from 'path'

describe('Download pkg binaries', function(){
    const url = 'https://api.github.com/repos/zeit/pkg-fetch/releases/latest'

    it('Check Releases', async function(done){
        let path
        try {
            path = await getBinary(url, 'win', 'x64', 'node10')
        } catch(err){
            assert.fail(err)
            done()
        }
        assert.equal(path, join(process.cwd(), 'temp'))
        
    })
})
