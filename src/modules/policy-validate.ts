export const policyValidate = (policy:any ):void => {

    // Validate that the statement is an  object or a string
    if (typeof policy != 'object') throw new Error('Error: Statement is not of type object.')

    // Check to see if the object adheres to the AWS spec found at 
    // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-creating-signed-url-custom-policy.html

    if (!policy.Statement || !Array.isArray(policy.Statement)) throw new Error('Policy.Statement is not of type \'Array\'')

    
    // Now we iterate over the statements to check for any that are invalid

    for (let key in policy.Statement){
        // Statements must have Resource property
        if (!policy.Statement[key].Resource) throw new Error(`Error: Statment[${key}] is missing property 'Resource'.`)
        // Statements must have Condition property
        if(!policy.Statement[key].Condition) throw new Error(`Error: Statment[${key}] is missing property Condition.`)
        // Condition must have DateLessThan property
        if (!policy.Statement[key].Condition.DateLessThan) throw new Error(`Error: Statment[${key}] is missing Condition property 'DateLessThan'.`)
        // DateLessThan must be of type object
        if (typeof policy.Statement[key].Condition.DateLessThan != 'object') throw new Error(`Error: Statment[${key}].Condition.DateLessThan is not of type 'object'. Type is ${typeof policy.Statement[key].Condition.DateLessThan}.`)
        // DateLessThan must have property 'AWS:EpochTime'
        if (!policy.Statement[key].Condition.DateLessThan['AWS:EpochTime'] && policy.Statement[key].Condition.DateLessThan['AWS:EpochTime'] !== 0) throw new Error(`Error: Statment[${key}].Condition.DateLessThan is missing property 'AWS:EpochTime'. Type is ${typeof policy.Statement[key].Condition.DateLessThan['AWS:EpochTime']}.`)
    }
}