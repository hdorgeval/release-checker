# Release Checker (alpha)

[![Build Status](https://travis-ci.org/hdorgeval/release-checker.svg?branch=master)](https://travis-ci.org/hdorgeval/release-checker)
[![Build status](https://ci.appveyor.com/api/projects/status/ltcrrup7unm78tir?svg=true)](https://ci.appveyor.com/project/hdorgeval/release-checker)
[![npm version](https://img.shields.io/npm/v/release-checker.svg)](https://www.npmjs.com/package/release-checker)

There are numerous ways to "shoot yourself in the foot" using `npm publish`. The purpose of this module is to validate that your project is ready to be published in a safe way.

It checks the following:

- package.json file is valid
- build pass (unreleased)
- tests pass
- there is no sensitive data embedded in the package that will be sent to the registry
- there is no useless files (like tests files) embedded in the package that will be sent to the registry
- there is no vulnerable dependencies (unreleased)
- there are no uncommitted changes in the working tree (unreleased)
- there are no untracked files in the working tree (unreleased)
- current branch is master (unreleased)
- git tag matches version specified in the `package.json` (unreleased)

## Warning

> If you are running node 8 or above, and the `package.json` file has an already existing `prepublish` script, you should rename that script to `prepublishOnly` before using `release-checker`.
>
> - Run `npm help scripts` to get more details.

## Install

- local install

  ```sh
  npm install --save-dev release-checker
  ```

  Then add this script in the `scripts` section of the `package.json` file:

  ```json
  "scripts": {
      "release-checker": "release-checker"
    },
  ```

- global install

  ```sh
  npm install -g release-checker
  ```

## Basic usage

- local install

  ```sh
  npm run release-checker
  ```

- global install

  ```sh
  release-checker
  ```

- zero install

  ```sh
  npx release-checker
  ```

## Command-line Options

When you specify no option, all checkers will run.

if you want to run only specific checkers, use the command-line options specific to these checkers.

### --customize-sensitivedata

Customize the sensitive or useless data checker.
This will create, in the current directory, a `.sensitivedata` file that you can customize to fit your needs.

```sh
npx release-checker --customize-sensitivedata
```

### -h, --help

Show help.

```sh
npx release-checker --help
```

### -s, --sensitivedata

Ensure there is no sensitive or useless data in the npm package.

```sh
npx release-checker --sensitivedata
```

### -t, --test

Ensure that command `npm test` is successfull.

```sh
npx release-checker --test
```

## Sensitive or useless data Checker

This Checker checks there is no sensitive and no useless files inside the to-be-published package. This check performs only if npm version is 5.9.0 or above.

It will detect the following files:

> - Benchmark files
> - Configuration files
>   - CI
>   - eslint
>   - GitHub
>   - JetBrains
>   - Visual Studio Code
> - Coverage files
> - Demo files
> - Dependency directories
> - Doc files
> - Example files
> - Log files
> - Private SSH key
> - Script files
> - Secret files
> - Source files
> - Temp files
> - Test files
> - Zip files
>   - Output of 'npm pack' command

These files are defined inside the built-in [.sensitivedata](lib/checkers/sensitive-data-checker/.sensitivedata) file.

You may completely override this file by creating a `.sensitivedata` file in the root directory of your project so that this checker fits your needs:

- to create this file, just run the command:

```sh
npx release-checker --customize-sensitivedata
```

- if you create your own `.sensitivedata` file, and the `package.json` file has n`files` section, consider adding `.sensitivedata` to the `.npmignore` file.

## Authors

- [Ivan Nikulin](https://github.com/inikulin)
- [Henri d'Orgeval](https://github.com/hdorgeval)

This project is a port of all validations provided by [publish-please](https://github.com/inikulin/publish-please)
