export const help = function help():void{

    console.log(
        'The following arugments are available:\n' +
        '--canned\t\tCreate a signed url using a canned policy.\n' +
        '--custom\t\tCreate a signed url using a custom policy.\n' +
        '--policy\t\tFile path or JSON string of the policy statement.\n' +
        '--key-pair-id\t\tThe CloudFront key pair ID.\n' +
        '--query\t\t\tJSON string of query parameters to be appended to the URL.\n' +
        '--key\t\t\tThe file path of the private key.\n' +
        `--version\t\tThe current version of the software.\n`
    )
}