import { assert } from 'chai'
import { policyValidate } from '../src/modules/policy-validate'
import { doesNotReject, fail } from 'assert';

describe('Validate Statement',function(){
    let policy
    beforeEach(function(){
        policy = {
            Statement: [
               {
                  Resource:'https://www.example.com',
                    Condition:{
                        DateLessThan:{
                            'AWS:EpochTime':Date.now()
                        }
                    }
               }
            ]
        }
    })
    it('Valid policy',function(){
        
        policyValidate(policy)
         
    })
    it('Invalid Statement: Statement missing',function(done){
        let invalidPolicy = {...policy}

        delete invalidPolicy.Statement

        try {
            policyValidate(invalidPolicy)
            fail()
        } catch(err){
            done()
        }
    }) 
    it('Invalid Statement: Statement[].Resource missing',function(done){
        let invalidPolicy = {...policy}
        delete invalidPolicy.Statement[0].Resource

        try {
            policyValidate(invalidPolicy)
            fail()
        } catch(err){
            done()
        }
    })
    it('Invalid Statement: Statement[].Resource not a string',function(done){
        let invalidPolicy = {...policy}
        delete invalidPolicy.Statement[0].Resource

        try {
            policyValidate(invalidPolicy)
            fail()
        } catch(err){
            done()
        }
    })
    it('Invalid Statement: Statement[].Condition missing',function(done){
        let invalidPolicy = {...policy}
        delete invalidPolicy.Statement[0].Condition

        try {
            policyValidate(invalidPolicy)
            fail()
        } catch(err){
            done()
        }
    })
    it('Invalid Statement: Statement[].Condition.DateLessThan missing',function(done){
        let invalidPolicy = {...policy}
        delete invalidPolicy.Statement[0].Condition.DateLessThan

        try {
            policyValidate(invalidPolicy)
            fail()
        } catch(err){
            done()
        }
    })
    it('Invalid Statement: Statement[].Condition.DateLessThan not an object',function(done){
        let invalidPolicy = {...policy}
        delete invalidPolicy.Statement[0].Condition.DateLessThan

        try {
            policyValidate(invalidPolicy)
            fail()
        } catch(err){
            done()
        }
    })
    it('Invalid Statement: Statement[].Condition.DateLessThan[\`AWS:EpochTime\'] not a number',function(done){
        let invalidPolicy = {...policy}
        delete invalidPolicy.Statement[0].Condition.DateLessThan['AWS:EpochTime']
        try {
            policyValidate(invalidPolicy)
            fail()
        } catch(err){
            done()
        }
    })
})

