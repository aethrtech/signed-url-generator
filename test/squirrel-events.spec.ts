import * as assert from 'assert'
import { check } from '../src/modules/squirrel-events'

describe('Handle squirrel events', function(){
    it('should return false by default', function(done) {
        check(bool => {
          assert.equal(bool, false)
          done()
        })
    });
})