# Contributing

<br />

Thank you for getting involved in this project! To begin, please review and sign the **[Contributor Licence Agreement]()**. This agreement is nothing to fear! It simply establishes a written agreement between you and the the maintainer(s) of this project, for their benefit and yours. Software can be a complex legal challenge, especially when things go wrong and matters of ownership. Everyone shares a delegated responsiblity in maintaining high standards during development. Contributers must work together under a common agreement of practices. Once the CLA has been signed, your issues and pull requests will be tagged as `CLA:approved`.


- [Setting Up The Project]()
- [Creating Private Keys]()
- [Installing Developer Dependencies]()
- [Testing]()
- [Debugging]()
- [Building]()
- [Reporting Bugs]()
- [Pull Requests]()

<br />

## **Setting Up The Project**

<br />

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

## **Creating Private Keys**

<br />

You will need to generate your own `private keys` for testing and developing. This can be performed by the following:

**Windows**

> **Note: Windows 10** supports the `shh-keygen` command from the terminal (an update may be required). **If this option is available to you, it is recommended to use the instructions for Linux/Mac OSX instead**. A [Linux subsystem](https://docs.microsoft.com/en-us/windows/wsl/about) can also be installed,  which may be used to generate `rsa` keys using a bash terminal. Alternatively, you may use git's integrated shell instead. If you are unsure how to perform this method, you may continue following the steps provided.

- Download **[PUTTYgen](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)**.
- Open **PUTTYgen**.
- Under _parameters_, Ensure that **RSA** is set as the type of key to generate.
- Under _parameters_, set _"Number of bits in generated key"_ to **4096**.
  - _Optional: Remove the key comment._
- Click **"Generate"**.
- Follow the on screen instructions.
- Click **Conversions** > **Export OpenSSH Key**.
- Enter the name of your new private key, **including the ".pem" extension**, and save it under the **test** directory.

<br />

**Linux/Mac OSX/Git (Shell)**

<br />

Use the following command to create a new private and public key. You do not need the public key, however, it may be useful for validating the signature.

```sh
 ssh-keygen -E sha1 -f ./signed-url-generator/test/rsa-key.pem
```

<br />

## Installing Developer Dependencies

<br />

Once you have generated your private key, you may wish to install developer dependencies unless you're a Renegade For Life&trade;.

```sh
npm i -D
```

> **Note**: This will also install (or update) [Squirrel]() installer.

<div style="display:flex">
    <a style="flex:1" href="#header-contributing">Top of Section</a>
    <a href="#table-of-contents">Back To Top</a>
</div>

<br />

## Testing

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

<br />

## Debugging

<br />

`signed-url-generator` is written in [TypeScript](). It must therefore be compiled into [JavaScript]() before the debugging. During this process, TypeScript can be configured to output source maps for the debugger to reference from the original code. The `tsconfig.json` file should handle this for you. _It is recommended not to change this option._

**VS Code Configuration**

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

<br />

## **Building**

<br />

`signed-url-generator` uses [pkg](https://github.com/zeit/pkg) to build binary executables. This process is usually performed by continuous integration tools, however, if you wish to build your own executable locally, use the following command:

```sh
npm run build
```

`Pkg` is preconfigured to prune dev dependencies before bundling. _It is recommended not to change this setting_.

After the script is completed, you should find your program compiled into a binary executable under `dist`.
