# **Signed URL Generator**

_A command line application and Node.JS library for creating AWS CloudFront signed URLs._

`Signed URL Generator` is a command line application and dependency-free library written in [TypeScript](https://www.typescriptlang.org), to help you generate signed URLs for your [AWS CloudFront](https://aws.amazon.com/cloudfront) distribution service. It can be used as a [Node.JS](https://nodejs.org) module, in a browser, or as a cross-platform standalone application, with support for [Adobe Flash Player](https://www.adobe.com/uk/products/flashplayer.html) compatibility! A demonstration is available [here]().

<br />

## Table of Contents

- [Downloads](#Downloads)
- [API](#API)
- [Examples](#API)
- [TypeScript](#TypeScript)
- [Contributing](#Contributing)
- [Troubleshooting](#Troubleshooting)

<br />

## Downloads

<br />

**Windows (MSI Installer)**

| Platform     | Link         |
|--------------|--------------|
|**32-bit**    | [Download]() |
|**64-bit**    | [Download]() |

 **Linux**

| Platform     | Link         |
|--------------|--------------|
|**64-bit**    | [Download]() |
|**armv6**     | [Download]() |
|**armv7**     | [Download]() |

**Mac OSX**

| Platform     | Link         |
|--------------|--------------|
|**64-bit**    | [Download]() |

**Node.JS**

_Via NPM_

```sh
npm i signed-url-generator
```

_Via Yarn_

```sh
yarn add signed-url-generator
```

**Browser**

| Platform     | Link         |
|--------------|--------------|
|**Latest**    | [Download]() |

_For other versions, see [releases]()._

<br />

**MD5 Checksums _(Latest)_**

| Platform | MD5 Sum |
| -------- | -------------|
| Windows (32-bit) Installer ||
| Windows (64-bit) Installer ||
| Linux (64-bit) Executable ||
| Linux (armv6) Executable ||
| Linux (armv7) Executable ||
| Mac OSX (64-bit) Installer ||

<br />

## API

<br />

### **Command Line**

`--canned`: Create a signed url using a canned policy.

`--custom`: Create a signed url using a custom policy.

`--policy`: File path or JSON string of the policy statement<a href="#cli-notes-1"><sup>\[1\]</sup></a>.

`--key-pair-id`: The CloudFront key pair ID.

`--query` _(optional)_:  Query parameters to be appended to the URL. Each parameter can be defined as `foo=bar`. Parameters without an explicit value will be given the value of `true` by default.

`--key`: The file path of the private key<a href="#cli-notes-2"><sup>\[2\]</sup>.</a>

`--expire-time`: An epoch timestamp used to expire a link after the desired time has lapsed.

`--is-flash` _(optional)_: Whether the hashed Signature needs to have special characters replaced for Adobe Flash Player.

`--help`: Displays a list of available arguments.

`--version`: The current version of the software.

<blockquote>
    <b>Notes</b>:
    <ol>
        <li id="cli-notes-1">JSON schema as defined by AWS documentation. See <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-creating-signed-url-canned-policy.html#private-content-canned-policy-statement-values">here</a> for <b>canned policy</b>, and <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-creating-signed-url-custom-policy.html#private-content-custom-policy-statement-examples">here</a> for <b>custom policy</b>.</li>
        <li id="cli-notes-2">SHA-1 algorithm recommended. See <a href="">link</a>.</li>
    </ol>
</blockquote>

<br />

### **Node.JS**

<br />

`signed-url-generator` call signature is written in _node style_ to maintain familiarity for developers.

### generate(policy, baseURL, keyPairId, privateKey [, options ]).canned()\<*String*\>

- **policy**: `object`<a href="#node-notes-1"><sup>\[1\]</sup></a>
- **baseURL**: `string`
- **keyPairId**: `string`
- **privateKey**: `Buffer`<a href="#node-notes-2"><sup>\[2\]</sup></a>
- **options**: `object` _(optional)_

Returns a `string` as a signed URL using a canned policy.

### generate(policy, baseURL, keyPairId, privateKey [, options ]).custom()<*String*\>

- **policy**: `object`<a href="#node-notes-1"><sup>\[1\]</sup></a>
- **baseURL**: `string`
- **keyPairId**: `string`
- **privateKey**: `Buffer`<a href="#node-notes-2"><sup>\[2\]</sup></a>
- **options**: `object` _(optional)_

Returns a `string` as a signed URL using a custom policy.

**Options**

This parameter can be used to append parameters to the URL. Depending on whether a canned policy or a custom policy is used, some of the parameters may be required.

- **query** : `object`
- **expireTime** : `number`
- **isFlash** : `boolean`

<blockquote>
    <b>Notes</b>:
    <ol>
        <li id="node-notes-1">JSON schema as defined by AWS documentation. See <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-creating-signed-url-canned-policy.html#private-content-canned-policy-statement-values">here</a> for <b>canned policy</b>, and <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-creating-signed-url-custom-policy.html#private-content-custom-policy-statement-examples">here</a> for <b>custom policy</b>.</li>
        <li id="node-notes-2">SHA-1 algorithm recommended. See <a href="">link</a>.</li>
    </ol>
</blockquote>

<br />

## Examples

[<div style="text-align: right">Back To Top</div>](#Table-of-Contents)

- [Creating A Signed URL Using A Canned Policy From Command Line](#Creating-A-Signed-URL-Using-A-Canned-Policy-From-Command-Line)

- [Creating A Signed URL Using A Custom Policy From Command Line](#Creating-A-Signed-URL-Using-A-Custom-Policy-From-Command-Line)

- [Creating A Signed URL Using A Canned Policy In Node (Server-Side)](#Creating-A-Signed-URL-Using-A-Canned-Policy-In-Node-(Server-Side))

- [Creating A Signed URL Using A Custom Policy In Node (Server-Side)](#Creating-A-Signed-URL-Using-A-Custom-Policy-In-Node-(Server-Side))

- [Creating A Signed URL Using A Canned Policy (Client-Side)](#Creating-A-Signed-URL-Using-A-Canned-Policy-(Client-Side))

- [Creating A Signed URL Using A Custom Policy (Client-Side)](#Creating-A-Signed-URL-Using-A-Custom-Policy-(Client-Side))

<br />

### Creating a signed URL Using A Canned Policy From Command Line

<br />

```sh
signed-url-generator --canned --policy "/path/to/policy.json" --base-url "https://my-cloudfront-domain.net" --key-pair-id "ABCDEFGHIJHLMN" --key "/path/to/private/key.pem" --query size=medium --query size=large --query "something else"
```

> **Notes:**
>
> - Query parameters containing a space (character [U+0020](https://en.wikipedia.org/wiki/Whitespace_character)) should be encased in double quotes (`""`) or single quotes (`''`) .
> - Query parameters are encoded as `application/x-www-urlencoded` MIME type. Therefore, parameters containg a space, (character [U+0020](https://en.wikipedia.org/wiki/Whitespace_character)) will be converted to '`+`'.
> - Multiple `--query` parameters are allowed.
> - `--query` parameters which are _not_ assigned a value (for example, `--query foo`) are given the value of `true` by default (`foo=true`).

<br /><br />

### Creating A Signed URL Using A Custom Policy From Command Line

<br />

```sh
signed-url-generator --custom --policy "/path/to/policy.json" --base-url "https://my-cloudfront-domain.net" --key-pair-id "ABCDEFGHIJHLMN" --key "/path/to/private/key.pem" --query size=medium --query size=large --query "something else"
```

<br />

> **Notes:**
>
> - Query parameters containing a space (character [U+0020](https://en.wikipedia.org/wiki/Whitespace_character)) should be encased in double quotes (`""`) or single quotes (`''`) .
> - Query parameters are encoded as `application/x-www-urlencoded` MIME type. Therefore, parameters containg a space, (character [U+0020](https://en.wikipedia.org/wiki/Whitespace_character)) will be converted to '`+`'.
> - Multiple `--query` parameters are allowed.
> - `--query` parameters which are _not_ assigned a value (for example, `--query foo`) are given the value of `true` by default (`foo=true`).

<br /><br />

### Creating A Signed URL Using A Canned Policy In Node (Server-Side)

<br />

**CommonJS (Node v8+)**

```Javascript

const readFileSync = require('fs').readFileSync,
generate = require('signed-url-generator').generate

// Read your key as a buffer.
const key = readFileSync('/path/to/key.pem'),

// baseURL of your CloudFront domain
baseURL = 'https://my-cloudfront-domain.net',

// Your CloudFront key pair ID
keyPairId = 'ABCDEFGHIJHLMN',

// declare your policy statement
policy = {
    Statement:[{
        Resource:'https://my-cloudfront-domain.net/my-s3-bucket/*',
        Condition:{
            DateLessThan:{
                'AWS:EpochTime': Date.now().getTime()
            }
        }
    }]
},

query = {
    size:medium,
    dpi:['lo','hi']
}

let url = generate(policy, baseUrl, keyPairId, privateKey, query).canned()

console.log(url)

```

<br />

**ES6+**

```Javascript

import { readFileSync } from 'fs'
import { generate } from 'signed-url-generator'

// Read your key as a buffer.
const key = readFileSync('/path/to/key.pem'),

// baseURL of your CloudFront domain
baseURL = 'https://my-cloudfront-domain.net',

// Your CloudFront key pair ID
keyPairId = 'ABCDEFGHIJHLMN'

// declare your policy statement
policy = {
    Statement:[
        Resource:'https://my-cloudfront-domain.net/my-s3-bucket/*',
        Condition:{
            DateLessThan:{
                'AWS:EpochTime': Date.now().getTime()
            }
        }
    ]
},

query = {
    size:medium,
    dpi:['lo','hi']
}

let url = generate(policy, baseUrl, keyPairId, privateKey, query).canned()

```

<br />

### **Creating A Signed URL Using A Custom Policy In Node (Server-Side)**

<br />

**CommonJS (Node v8+)**

```Javascript

const readFileSync = require('fs').readFileSync,
generate = require('signed-url-generator').generate

// Read your key as a buffer.
const key = readFileSync('/path/to/key.pem'),

// baseURL of your CloudFront domain
baseURL = 'https://my-cloudfront-domain.net',

// Your CloudFront key pair ID
keyPairId = 'ABCDEFGHIJHLMN',

// declare your policy statement
policy = {
    Statement:[
        Resource:'https://my-cloudfront-domain.net/my-s3-bucket/*',
        Condition:{
            DateLessThan:{
                'AWS:EpochTime': Date.now().getTime()
            }
        }
    ]
},

query = {
    size:medium,
    dpi:['lo','hi']
}

let url = generate(policy, baseUrl, keyPairId, privateKey, query).custom()

console.log(url)

```

<br />

**ES6+**

```Javascript

import { readFileSync } from 'fs'
import { generate } from 'signed-url-generator'

// Read your key as a buffer.
const key = readFileSync('/path/to/key.pem'),

// baseURL of your CloudFront domain
baseURL = 'https://my-cloudfront-domain.net',

// Your CloudFront key pair ID
keyPairId = 'ABCDEFGHIJHLMN'

// declare your policy statement
policy = {
    Statement:[
        Resource:'https://my-cloudfront-domain.net/my-s3-bucket/*',
        Condition:{
            DateLessThan:{
                'AWS:EpochTime': Date.now().getTime()
            }
        }
    ]
},

query = {
    size:medium,
    dpi:['lo','hi']
}

let url = generate(policy, baseUrl, keyPairId, privateKey, query).custom()

console.log(url)

```

<br />

### **Creating A Signed URL Using A Canned Policy (Client-Side)**

<br />

```Html
<input id="fileInput" type="file" />
<script src="" />
<script>
    // Instansiate a new FileReader
    var fileReader = new FileReader(),
    fileInput = document.getElementById('fileInput')

    fileReader.onload = function(event){

        // Retreive the array buffer of the private key
        var privateKey = event.target.value

        // baseURL of your CloudFront domain
        baseURL = 'https://my-cloudfront-domain.net',

        // Your CloudFront key pair ID
        keyPairId = 'ABCDEFGHIJHLMN',

        // declare your policy statement
        policy = {
            Statement:[
                Resource:'https://my-cloudfront-domain.net/my-s3-bucket/*',
                Condition:{
                    DateLessThan:{
                        'AWS:EpochTime': Date.now().getTime()
                    }
                }
            ]
        },

        query = {
            size:medium,
            dpi:['lo','hi']
        }


        var url = SignedUrl.generate(policy, baseUrl, keyPairId, privateKey, query).canned()

        window.alert(url)

    }

    fileInput.onchange = function(){
        /*  fileReader will retain a list of files that have been
            selected, using a FileList object. We will retrieve this
            by referencing to the object stored within key 0 of files,
            as pass it into the fileReader as an array buffer. For more
            information, see https://developer.mozilla.org/en-US/docs/Web/API/FileReader
        */
        fileReader.readAsArrayBuffer(this.files[0])
    }
</script>
```

<br />

### Creating A signed URL Using A Custom Policy (Client-Side)

<br />

```Html
<input id="fileInput" type="file" />
<script src="" />
<script>
    // Instansiate a new FileReader
    var fileReader = new FileReader(),
    fileInput = document.getElementById('fileInput')
    fileReader.onload = function(event){

    // Retreive the array buffer of the private key
    var privateKey = event.target.value

    // baseURL of your CloudFront domain
    baseURL = 'https://my-cloudfront-domain.net',

    // Your CloudFront key pair ID
    keyPairId = 'ABCDEFGHIJHLMN',

    // declare your policy statement
    policy = {
        Statement:[
            Resource:'https://my-cloudfront-domain.net/my-s3-bucket/*',
            Condition:{
                DateLessThan:{
                    'AWS:EpochTime': Date.now().getTime()
                }
            }
        ]
    },

    query = {
        size:medium,
        dpi:['lo','hi']
    }


    var url = SignedUrl.generate(policy, baseUrl, keyPairId, privateKey, query).custom()

    window.alert(url)

    }

    fileInput.onchange = function(){
        /*  fileReader will retain a list of files that have been
            selected, using a FileList object. We will retrieve this
            by referencing to the object stored within key 0 of files,
            as pass it into the fileReader as an array buffer. For more
            information, see https://developer.mozilla.org/en-US/docs/Web/API/FileReader 
        */
        fileReader.readAsArrayBuffer(this.files[0])
    }
</script>
```

<br />

## TypeScript

**No.**

<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />

**_Just kidding!_**

You may download the type definitions by using the following command:

```sh
npm i -D @types/signed-url-generator
```

<br />

## Contributing

[<div style="text-align: right">Back To Top</div>](#Table-of-Contents)

Thanks! Please see [Contributing](docs/contributing.md) section.

<br />

## Reporting Bugs

Found a problem? Got a solution? Check out the [Reporting Bugs]().

<br />

## Pull Requests

Found a problem and fixed it yourself? Had a good idea you think would be a useful feature to have? Great! Thank you very much! After signing the **[Contributer Licence Agreement]()**, please open a new pull request.

Before submitting a pull request, please make sure the following criteria are met:

- All tests are passing.
- Any additional licences are updated in [Licence.txt]()

<br />

## Troubleshooting

If a problem has arisen using `signed-url-generator`, take a look on the [issues]() page to see if a solution has been found. Should no such answer warrant a sufficient answer, a new issue may be raised. Where possible, it is recommended to retain relevance to the guidelines set out by the [reporting bugs](#reporting-bugs) section.

<div style="display:flex">
    <a style="flex:1" href="#header-contributing">Top of Section</a>
    <a href="#table-of-contents">Back To Top</a>
</div>

<br /><br />

Licence: <a href="https://spdx.org/licenses/BSD-3-Clause">BSD-3-Clause</a>. &copy; MyWebula, 2019.

[Back To Top](#Table-of-Contents)
