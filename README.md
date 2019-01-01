# Release Checker (alpha)

[![Build Status](https://travis-ci.org/hdorgeval/release-checker.svg?branch=master)](https://travis-ci.org/hdorgeval/release-checker)
[![Build status](https://ci.appveyor.com/api/projects/status/ltcrrup7unm78tir?svg=true)](https://ci.appveyor.com/project/hdorgeval/release-checker)
[![npm version](https://img.shields.io/npm/v/release-checker.svg)](https://www.npmjs.com/package/release-checker)

There are numerous ways to "shoot yourself in the foot" using `npm publish`. The purpose of this module is to validate that your project is ready to be published in a safe way.

## Install

Install with [npm](https://www.npmjs.com/):

### local install

```sh
npm install --save-dev release-checker
```

Then add this script in the `scripts` section of the `package.json` file:

```json
"scripts": {
    "release-checker": "release-checker"
  },
```

### global install

```sh
npm install -g release-checker
```

## Basic usage

### local install

```sh
npm run release-checker -- <options>
```

### global install

```sh
release-checker <options>
```

### zero install

```sh
npx release-checker <options>
```

## Command-line Options

When you specify no option the following validation is run:

- `package.json` validation: checking that package.json file exists and is valid

### -h, --help

Displays commands' usage information.

```sh
npx release-checker --help
```

### -t, --test (unreleased)

Ensure that command `npm test` is successfull

```sh
npx release-checker --test
```

## Authors

- [Ivan Nikulin](https://github.com/inikulin)
- [Henri d'Orgeval](https://github.com/hdorgeval)

This project is a port of all validations provided by [publish-please](https://github.com/inikulin/publish-please)
