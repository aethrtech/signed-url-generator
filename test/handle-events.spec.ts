import * as assert from 'assert'
import { check } from '../src/modules/squirrel-events'

describe('Handle squirrel events', function(){
    it('should return false by default', function() {
        assert.equal(check(), false);
      });
})