# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html)

## [0.7.0] - 2019-01-22

### Added

- git untracked files checker

## [0.6.0] - 2019-01-20

### Added

- git branch checker

## [0.5.2] - 2019-01-18

### Fixed

- fix typo in README

## [0.5.1] - 2019-01-17

### Fixed

- use the custom `.sensitivedata` file created in project directory instead of the built-in `.sensitivedata` file.

## [0.5.0] - 2019-01-17

### Added

- be able to customize the sensitive and non essential data checker

## [0.4.1] - 2019-01-16

### Fixed

- remove console.log in sensitive data and non essential data checker

## [0.4.0] - 2019-01-15

### Added

- sensitive data and non essential data checker

### Modified

- package.json checker emits a warning when there is a `prepublish`script in the `scripts`section

## [0.3.0] - 2019-01-11

### Added

- be able to process errors as warnings
- run by default all validators when there is no option on the command-line

## [0.2.0] - 2019-01-03

### Added

- tests validation: checking that command `npm test` is successfull

## [0.1.0] - 2019-01-01

### Added

- `package.json` validation: checking that package.json file exists and is valid

## [0.0.3] - 2018-12-26

### Added

- be able to show CLI usage on --help or -h command-line option

## [0.0.2] - 2018-12-25

### Fixed

- remove unneeded console.log

## [0.0.1] - 2018-12-25

### Added

- be able to detect that no option has been set on command-line
