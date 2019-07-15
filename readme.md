# **Signed URL Generator**

_A command line application and Node.JS library for creating AWS CloudFront signed URLs._

`Signed URL Generator` is a command line application and dependency-free library written in [TypeScript](https://www.typescriptlang.org), to help you generate signed URLs for your [AWS CloudFront](https://aws.amazon.com/cloudfront) distribution service. It can be used as a [Node.JS](https://nodejs.org) module, in a browser, or as a cross-platform standalone application, with support for [Adobe Flash Player](https://www.adobe.com/uk/products/flashplayer.html) compatibility! A demonstration is available [here]().

<div id="header-table-of-contents"></div>

# Table of Contents

<ul style="list-style:none; font-size:medium">
    <li><a href="#header-downloads">Downloads</a></li>
    <li><a href="#header-api">API</a></li>
    <li><a href="#header-examples">Examples</a></li>
    <li><a href="#header-typescript">TypeScript</a></li>
    <li><a href="#header-contributing">Contributing</a></li>
    <li><a href="#header-troubleshooting">Troubleshooting</a></li>
</ul>

<div id="header-downloads"></div>

# Downloads

[<div style="text-align: right">Back To Top</div>](#Table-of-Contents)

### **Windows (MSI Installer)**

| Platform     | Link         |
|--------------|--------------|
|**32-bit**    | [Download]() |
|**64-bit**    | [Download]() |


### **Linux**

| Platform     | Link         |
|--------------|--------------|
|**64-bit**    | [Download]() |
|**armv6**     | [Download]() |
|**armv7**     | [Download]() |




### **Mac OSX**

| Platform     | Link         |
|--------------|--------------|
|**64-bit**    | [Download]() |


### **Node.JS**

**NPM**
```
npm i signed-url-generator
```

**Yarn**
```
yarn add signed-url-generator
```


### **Browser**

| Platform     | Link         |
|--------------|--------------|
|**Latest**    | [Download]() |

_For other versions, see [releases]()._

<br />

### **MD5 Checksums** _(Latest)_

| Platform | MD5 Sum |
| -------- | -------------|
| Windows (32-bit) Installer ||
| Windows (64-bit) Installer ||
| Linux (64-bit) Executable ||
| Linux (armv6) Executable ||
| Linux (armv7) Executable ||
| Mac OSX (64-bit) Installer ||

<br />

<div style="display:flex">
    <a style="flex:1" href="#header-downloads">Top of Section</a>
    <a href="#table-of-contents">Back To Top</a>
</div>

<div id="header-api"></div>

# API

[<div style="text-align: right">Back To Top</div>](#Table-of-Contents)

## **Command Line**

`--canned`: Create a signed url using a canned policy.

`--custom`:	Create a signed url using a custom policy.

`--policy`:	File path or JSON string of the policy statement<a href="#cli-notes-1"><sup>\[1\]</sup></a>.

`--key-pair-id`: The CloudFront key pair ID.

`--query` _(optional)_:  Query parameters to be appended to the URL. Each parameter can be defined as `foo=bar`. Parameters without an explicit value will be given the value of `true` by default.

`--key`: The file path of the private key<a href="#cli-notes-2"><sup>\[2\]</sup>.</a>

`--expire-time`: An epoch timestamp used to expire a link after the desired time has lapsed.

`--is-flash` _(optional)_: Whether the hashed Signature needs to have special characters replaced for Adobe Flash Player.

`--help`: Displays a list of available arguments.

`--version`: The current version of the software.

>**Notes:**
>
> <ol style="list-style-type:decimal"><li id="cli-notes-1">JSON schema as defined by AWS documentation. See <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-creating-signed-url-canned-policy.html#private-content-canned-policy-statement-values">here</a> for <b>canned policy</b>, and <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-creating-signed-url-custom-policy.html#private-content-custom-policy-statement-examples">here</a> for <b>custom policy</b>.</li><li id="cli-notes-2">SHA-1 algorithm recommended. See <a href="">link</a>.</li></ol>

<br />

[<div style="text-align: right">Back To Top</div>](#Table-of-Contents)

## **Node.JS**

<div style="display:flex">
    <a style="flex:1" href="#header-api">Top of Section</a>
    <a href="#table-of-contents">Back To Top</a>
</div>

`signed-url-generator` call signature is written in _node style_ to maintain familiarity for developers.

## generate(policy, baseURL, keyPairId, privateKey [, options ]).canned()\<*String*\>
    
* **policy**: `object`<a href="#node-notes-1"><sup>\[1\]</sup></a>
* **baseURL**: `string`
* **keyPairId**: `string`
* **privateKey**: `Buffer`<a href="#node-notes-2"><sup>\[2\]</sup></a>
* **options**: `object` _(optional)_

Returns a `string` as a signed URL using a canned policy.

## generate(policy, baseURL, keyPairId, privateKey [, options ]).custom()<*String*\>
    
* **policy**: `object`<a href="#node-notes-1"><sup>\[1\]</sup></a>
* **baseURL**: `string`
* **keyPairId**: `string`
* **privateKey**: `Buffer`<a href="#node-notes-2"><sup>\[2\]</sup></a>
* **options**: `object` _(optional)_

Returns a `string` as a signed URL using a custom policy.

### **Options**

This parameter can be used to append parameters to the URL. Depending on whether a canned policy or a custom policy is used, some of the parameters may be required.

* **query** : `object`
* **expireTime** : `number`
* **isFlash** : `boolean`


>**Notes:**
>
> <ol style="list-style-type:decimal"><li id="cli-notes-1">JSON schema as defined by AWS documentation. See <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-creating-signed-url-canned-policy.html#private-content-canned-policy-statement-values">here</a> for <b>canned policy</b>, and <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-creating-signed-url-custom-policy.html#private-content-custom-policy-statement-examples">here</a> for <b>custom policy</b>.</li><li id="cli-notes-2">SHA-1 algorithm recommended. See <a href="">link</a>.</li></ol>

<div style="display:flex">
    <a style="flex:1" href="#header-api">Top of Section</a>
    <a href="#table-of-contents">Back To Top</a>
</div>

<div id="header-examples"></div>

# Examples

[<div style="text-align: right">Back To Top</div>](#Table-of-Contents)

- [Creating A Signed URL Using A Canned Policy From Command Line](#Creating-A-Signed-URL-Using-A-Canned-Policy-From-Command-Line)

- [Creating A Signed URL Using A Custom Policy From Command Line](#Creating-A-Signed-URL-Using-A-Custom-Policy-From-Command-Line)

- [Creating A Signed URL Using A Canned Policy In Node (Server-Side)](#Creating-A-Signed-URL-Using-A-Canned-Policy-In-Node-(Server-Side))

- [Creating A Signed URL Using A Custom Policy In Node (Server-Side)](#Creating-A-Signed-URL-Using-A-Custom-Policy-In-Node-(Server-Side))

- [Creating A Signed URL Using A Canned Policy (Client-Side)](#Creating-A-Signed-URL-Using-A-Canned-Policy-(Client-Side))

- [Creating A Signed URL Using A Custom Policy (Client-Side)](#Creating-A-Signed-URL-Using-A-Custom-Policy-(Client-Side))

<br />

## **Creating a signed URL Using A Canned Policy From Command Line**
<br />


```sh
signed-url-generator --canned --policy "/path/to/policy.json" --base-url "https://my-cloudfront-domain.net" --key-pair-id "ABCDEFGHIJHLMN" --key "/path/to/private/key.pem" --query size=medium --query size=large --query "something else"
```

> **Note:** Query parameters containing a space (character [U+0020](https://en.wikipedia.org/wiki/Whitespace_character)) should be encased in double quotes (`""`) or single quotes (`''`) .

> **Note:** Query parameters are encoded as `application/x-www-urlencoded` MIME type. Therefore, parameters containg a space, (character [U+0020](https://en.wikipedia.org/wiki/Whitespace_character)) will be converted to '`+`'.

> **Note:** Multiple `--query` parameters are allowed.

> **Note** `--query` parameters which are _not_ assigned a value (for example, `--query foo`) are given the value of `true` by default (`foo=true`).
<br />

<div style="display:flex"><a style="flex:1" href="#header-examples">Top of Section</a><a href="#Table-of-Contents">Back To Top</a></div>

## **Creating A Signed URL Using A Custom Policy From Command Line**

<br />

```sh
signed-url-generator --custom --policy "/path/to/policy.json" --base-url "https://my-cloudfront-domain.net" --key-pair-id "ABCDEFGHIJHLMN" --key "/path/to/private/key.pem" --query size=medium --query size=large --query "something else"
```
> **Note:** Query parameters containing a space (character [U+0020](https://en.wikipedia.org/wiki/Whitespace_character)) should be encased in double quotes (`""`) or single quotes (`''`) .

> **Note:** Query parameters are encoded as `application/x-www-urlencoded` MIME type. Therefore, parameters containg a space, (character [U+0020](https://en.wikipedia.org/wiki/Whitespace_character)) will be converted to '`+`'.

> **Note:** Multiple `--query` parameters are allowed.

> **Note** `--query` parameters which are _not_ assigned a value (for example, `--query foo`) are given the value of `true` by default (`foo=true`).

<div style="display:flex"><a style="flex:1" href="#header-examples">Top of Section</a><a href="#table-of-contents">Back To Top</a></div>

## **Creating A Signed URL Using A Canned Policy In Node (Server-Side)**

### **CommonJS (Node v8+)**

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
<div style="display:flex"><a style="flex:1" href="#header-examples">Top of Section</a><a href="#table-of-contents">Back To Top</a></div>

### **ES6+**

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
<div style="display:flex"><a style="flex:1" href="#header-examples">Top of Section</a><a href="#table-of-contents">Back To Top</a></div>

## **Creating A Signed URL Using A Custom Policy In Node (Server-Side)**

### **CommonJS (Node v8+)**

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
<div style="display:flex"><a style="flex:1" href="#header-examples">Top of Section</a><a href="#table-of-contents">Back To Top</a></div>

### **ES6+**

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

<div style="display:flex"><a style="flex:1" href="#header-examples">Top of Section</a><a href="#table-of-contents">Back To Top</a></div>

## **Creating A Signed URL Using A Canned Policy (Client-Side)**

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


        var url = CreateSignedUrl.generate(policy, baseUrl, keyPairId, privateKey, query).canned()

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

<div style="display:flex"><a style="flex:1" href="#header-examples">Top of Section</a><a href="#Table-of-Contents">Back To Top</a></div>

## **Creating a signed URL using a custom policy (Client-Side)** 

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


        var url = CreateSignedUrl.generate(policy, baseUrl, keyPairId, privateKey, query).custom()

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

<div style="display:flex">
    <a style="flex:1" href="#header-examples">Top of Section</a>
    <a href="#table-of-contents">Back To Top</a>
</div>

<br />

<div id="header-typescript"></div>

# TypeScript

[<div style="text-align: right">Back To Top</div>](#Table-of-Contents)

**No.**

<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />

**_Just kidding!_**

You may download the type definitions by using the following command:

```sh
npm i -D @types/signed-url-generator
```

<div id="header-contributing"></div>

# Contributing

[<div style="text-align: right">Back To Top</div>](#Table-of-Contents)

<br />

Thank you for getting involved in this project! To begin, please review and sign the **[Contributor Licence Agreement]()**. This agreement is nothing to fear! It simply establishes a written agreement between you and the the maintainer(s) of this project, for their benefit and yours. Software can be a complex legal challenge, especially when things go wrong and matters of ownership. Everyone shares a delegated responsiblity in maintaining high standards during development. Contributers must work together under a common agreement of practices. Once the CLA has been signed, your issues and pull requests will be tagged as `CLA:approved`.

<ul style="list-style:none; font-size:medium">
    <li><a href="#setting-up-the-project">Setting Up The Project</a></li>
    <li><a href="#creating-private-keys">Creating Private Keys</a></li>
    <li><a href="#installing-developer-dependencies">Installing Developer Dependencies</a></li>
    <li><a href="#testing">Testing</a></li>
    <li><a href="#debugging">Debugging</a></li>
    <li><a href="#building">Building</a></li>
    <li><a href="#reporting-bugs">Reporting Bugs</a></li>
    <li><a href="#pull-requests">Pull Requests</a></li>
</ul>

## **Setting Up The Project**

<div style="display:flex">
    <a style="flex:1" href="#header-contributing">Top of Section</a>
    <a href="#table-of-contents">Back To Top</a>
</div>

To begin, fork the master branch into your own respository.

Once forked, clone your fork to your local machine by using the following command in a terminal:

```sh 
git clone https://github.com/<YOUR_USERNAME>/<YOUR_FORK>.git
```

> **Note:** Replace `<YOUR_USERNAME>` with your username.

This will ensure your changes do not apply directly onto the master branch.

Once cloned, change the working directory to `signed-url-generator`.

```sh
cd signed-url-generator
```

Add the `master branch` as the remote upstream.

```sh
git remote add upstream https://github.com/ffarhadii/signed-url-generator
```

Verify the upsteam was added by typing `git remote -v`

```sh
git remote -v
```

it should produce the following output:

```sh
> origin    https://github.com/<YOUR_USERNAME>/<YOUR_FORK>.git  (fetch)
> origin    https://github.com/<YOUR_USERNAME>/<YOUR_FORK>.git  (push)
> upstream  https://github.com/ffarhadii/signed-url-generator.git  (fetch)
> upstream  https://github.com/ffarhadii/signed-url-generator.git  (push)
```

<br />

<div style="display:flex">
    <a style="flex:1" href="#header-contributing">Top of Section</a>
    <a href="#table-of-contents">Back To Top</a>
</div>

## **Creating Private Keys**

<div style="display:flex">
    <a style="flex:1" href="#header-contributing">Top of Section</a>
    <a href="#table-of-contents">Back To Top</a>
</div>

You will need to generate your own `private keys` for testing and developing. This can be performed by the following:

### **Windows**

> **Note: Windows 10** supports the `shh-keygen` command from the terminal (an update may be required). **If this option is available to you, it is recommended to use the instructions for Linux/Mac OSX instead**. A [Linux subsystem](https://docs.microsoft.com/en-us/windows/wsl/about) can also be installed,  which may be used to generate `rsa` keys using a bash terminal. Alternatively, you may use git's integrated shell instead. If you are unsure how to perform this method, you may continue following the steps provided.


<ol style="list-style-type:decimal"><li>Download <a href="https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html"><strong>PUTTYgen</strong></a>.</li><li>Open <strong>PUTTYgen</strong>.</li><li>Under <em>parameters</em>, Ensure that <strong>RSA</strong> is set as the type of key to generate.</li><li>Under <em>parameters</em>, set <em>"Number of bits in generated key"</em> to <strong>4096</strong>. </li><ul style="list-style-type:circle""><li><em>Optional: Remove the key comment.</em></li></ul><li>Click <strong>"Generate"</strong>.</li><li>Follow the on screen instructions.</li><li>Click <strong>Conversions</strong> > <strong>Export OpenSSH Key</strong>.</li><li>Enter the name of your new private key, <strong>including the ".pem" extension</strong>, and save it under the <strong>test</strong> directory.</li></ol>

### **Linux/Mac OSX/Git (Shell)**

<div style="display:flex">
    <a style="flex:1" href="#header-contributing">Top of Section</a>
    <a href="#table-of-contents">Back To Top</a>
</div>

Use the following command to create a new private and public key. You do not need the public key, however, it may be useful for validating the signature.

```sh
 ssh-keygen -E sha1 -f ./signed-url-generator/test/rsa-key.pem
```

<div style="display:flex">
    <a style="flex:1" href="#header-contributing">Top of Section</a>
    <a href="#table-of-contents">Back To Top</a>
</div>


## **Installing Developer Dependencies**

<div style="display:flex">
    <a style="flex:1" href="#header-contributing">Top of Section</a>
    <a href="#table-of-contents">Back To Top</a>
</div>

Once you have generated your private key, you may wish to install developer dependencies unless you're a Renegade For Life&trade;.

```sh
npm i -D
```

> **Note**: This will also install (or update) [Squirrel]() installer.

<div style="display:flex">
    <a style="flex:1" href="#header-contributing">Top of Section</a>
    <a href="#table-of-contents">Back To Top</a>
</div>


## **Testing**

<div style="display:flex">
    <a style="flex:1" href="#header-contributing">Top of Section</a>
    <a href="#table-of-contents">Back To Top</a>
</div>

Before beginning development, it is _highly_ recommended you run `npm test` to make sure the software is running normally. If you encounter encounter an unexpected error, you may raise it as an issue. See [Reporting Bugs](#reporting-bugs) section for more information on how to report bugs.

```sh
npm test
```
Example of output:

`signed-url-generator` uses **T**est-**D**riven **D**eployment pattern to ensure 100% test coverage is achieved. Before you begin writing your code, you _should_ write your test and then run `npm test` again to ensure [mocha]() is detecting the new test.

> **Note**: After creating a blank test, `npm test` is expected to fail. This is normal and will resolve once the code is written to make the test pass. You may write your test first and then import your new code into the test, which helps reduce duplication.

`signed-url-generator` uses continuous integration when deploying newer versions. Part of this process involves running tests to ensure faulty modules do not cause regression. See [pull requests](#Pull-Requests) for more details on the deployment process.

<div style="display:flex">
    <a style="flex:1" href="#header-contributing">Top of Section</a>
    <a href="#table-of-contents">Back To Top</a>
</div>

## **Debugging**

<div style="display:flex">
    <a style="flex:1" href="#header-contributing">Top of Section</a>
    <a href="#table-of-contents">Back To Top</a>
</div>

`signed-url-generator` is written in [TypeScript](). It must therefore be compiled into [JavaScript]() before the debugging. During this process, TypeScript can be configured to output source maps for the debugger to reference from the original code. The `tsconfig.json` file should handle this for you. _It is recommended not to change this option._


### VS Code Configuration

```Json
{
    "version": "0.2.0",
    "configurations": [{
        "type": "node",
        "request": "launch",
        "name": "Launch Program",
        "program": "${workspaceFolder}/out/index.js",
        "args":[],
        "preLaunchTask": "tsc: build - tsconfig.json",
        "outFiles": [
        "${workspaceFolder}/out/**/*.js"
        ],
        "sourceMaps": true
    }]
}
```
> **Note**: Be sure to populate the`"args"` paramater before running your the program. The available parameters can be found under the [Command Line](#Command-Line) section.

<div style="display:flex">
    <a style="flex:1" href="#header-contributing">Top of Section</a>
    <a href="#table-of-contents">Back To Top</a>
</div>

## **Building**

<div style="display:flex">
    <a style="flex:1" href="#header-contributing">Top of Section</a>
    <a href="#table-of-contents">Back To Top</a>
</div>

`signed-url-generator` uses [pkg](https://github.com/zeit/pkg) to build binary executables. This process is usually performed by continuous integration tools, however, if you wish to build your own executable locally, use the following command:

```sh
npm run build
```

`Pkg` is preconfigured to prune dev dependencies before bundling. _It is recommended not to change this setting_.

After the script is completed, you should find your program compiled into a binary executable under `dist`.

<div style="display:flex">
    <a style="flex:1" href="#header-contributing">Top of Section</a>
    <a href="#table-of-contents">Back To Top</a>
</div>

## **Reporting Bugs**

<div style="display:flex">
    <a style="flex:1" href="#header-contributing">Top of Section</a>
    <a href="#table-of-contents">Back To Top</a>
</div>

Local system configurations may differ from that which was used to develop software. Given the vast amount of possibilities, it is inevitable that some bugs slip through despite best intentions. To report a bug, open a new issue. Please report a bug using the following template below:

---

# Summary
| Software | Version | Platform |
|----------|---------|----------|
| Signed Url Generator| | |
| Operating System | | |


# Code Sample
_How are you using the software?_
```
[Your sample here] // Replace this
```

# Expected Output
```
[Your expected output] // Replace this
```

# Current Output

```
[Place your output here] // Replace this
```

# Possible Solution

_(Optional)_

# Description

_Describe your problem here._

<div style="display:flex">
    <a style="flex:1" href="#header-contributing">Top of Section</a>
    <a href="#table-of-contents">Back To Top</a>
</div>

## **Pull Requests**

<div style="display:flex">
    <a style="flex:1" href="#header-contributing">Top of Section</a>
    <a href="#table-of-contents">Back To Top</a>
</div>

Found a problem and fixed it yourself? Had a good idea you think would be a useful feature to have? Great! Thank you very much! After signing the **[Contributer Licence Agreement]()**, please open a new pull request.

Before submitting a pull request, please make sure the following criteria are met:

<ul style="list-style-type:disc">
    <li>All tests are passing.</li>
    <li>Any additional licences are updated in <a href=""><code>Licence.txt</code></a>.</li>
</ul>

<div style="display:flex">
    <a style="flex:1" href="#header-contributing">Top of Section</a>
    <a href="#table-of-contents">Back To Top</a>
</div>

# Troubleshooting

<div style="display:flex">
    <a style="flex:1" href="#header-contributing">Top of Section</a>
    <a href="#table-of-contents">Back To Top</a>
</div>

If a problem has arisen using `signed-url-generator`, take a look on the [issues]() page to see if a solution has been found. Should no such answer warrant a sufficient answer, a new issue may be raised. Where possible, it is recommended to retain relevance to the guidelines set out by the [reporting bugs](#reporting-bugs) section.

<div style="display:flex">
    <a style="flex:1" href="#header-contributing">Top of Section</a>
    <a href="#table-of-contents">Back To Top</a>
</div>

<br /><br />

Licence: <a href="https://spdx.org/licenses/BSD-3-Clause">BSD-3-Clause</a>. &copy; MyWebula, 2019.

[<div style="text-align: right">Back To Top</div>](#Table-of-Contents)