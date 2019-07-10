interface Statement {
    Resource:string,
    Condition: {
        DateLessThan:{
            'AWS:EpochTime': string | number
        }
        DateGreaterThan?: string | number,
        IpAddress?: string | number

    }
}

export interface Policy {
    Statement:Array<Statement>
}
