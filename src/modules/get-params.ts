export const getParams = function getParams(args):object{
    let params:object = {}
    Object.values(args)
    .filter((val,i) => args[i - 1] == '--query')
    .forEach((param:any) => {
        let value = param.split('=')
        if (params[value[0]] != undefined){
            if (typeof params[value[0]] === 'string') params[value[0]] = [params[value[0]]] 
            params[value[0]] = [...params[value[0]],value[1]]
        } else {
            params[value[0]] = value[1] ? value[1] : true 

            
        }
    })

    return params
}