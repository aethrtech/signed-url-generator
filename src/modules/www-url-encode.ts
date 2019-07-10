export const wwwUrlEncode = function encode(obj:object){
    let query:string = ''

    for (let key in obj){
        // Check if property is an array
        if (Array.isArray(obj[key])){
            for (let prop of obj[key]){
                query += `${key}=${prop}&` 
            }
            continue
        }
        query += `${key}=${obj[key]}&`
    }
    // Remove the last ampersand and change spaces to +
    return query.replace(/&$/g,'').replace(/\s/g,'+')
}