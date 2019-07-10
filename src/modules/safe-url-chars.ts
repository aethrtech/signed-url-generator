export const safeUrlChars = function replace(hex:string, flashCompat?:boolean ){

    let sanitised = hex.toString().replace(/\+/g,'-').replace(/=/g,'_').replace(/\//g,'~').replace(/\s/g,'%20')
    
    if (flashCompat) sanitised =  sanitised.replace(/\?/g,'%3F').replace(/&/g,'%26')

    return sanitised
}