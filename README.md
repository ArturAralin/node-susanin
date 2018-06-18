# node-susanin
This library facilitate describing endpoints for REST API servers. The main feature of this library is determining method, path, controller, middlewares, and validation of query object, url object and body object with one object.

If you have any ideas or question just leave issue [here](https://github.com/ArturAralin/node-susanin/issues/new)

# Getting Started
Follow to install module

* `npm install node-susanin --save`
* Look example.

# API References
See [here](https://github.com/ArturAralin/node-susanin/blob/master/api-documentation/general.md)

# Changelog
## [1.4.0] - 2018-05-30
### Updated
- New `onReply` behaviour. [More details](https://github.com/ArturAralin/node-susanin/blob/master/api-documentation/routerConfiguration.md#Формирование-ответа-пользователю)
## [1.3.5] - 2018-05-25
### Updated
- `errorP` now avaliable from package.
- `reply` now supports promises as argument
## [1.3.3] - 2018-04-18
### Added
- `errorP` fuction to controller params
## [1.3.1] - 2018-04-09
### Updated
- interface of `build-docs` has been changed
- fix `apidoc` text generation

## [1.3.0] - 2018-04-06
### Added
- Add `info` to the `Route` interface
- Add cli command `oe-router build-docs` (alpha)
- Remove spread operator for node 6 compatibility
## [1.2.0] - 2017-12-20
### Added
- Update `package-lock.json`
- Add `body`, `params` and `query` to middleware object of arguments

---
MIT License

Copyright (c) 2018 Artur A.
