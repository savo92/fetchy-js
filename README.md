# fetchy-js
> Just another AJAX/HTTP library

[![Build Status](https://travis-ci.org/savo92/fetchy-js.svg?branch=master)](https://travis-ci.org/savo92/fetchy-js)

**This library is in active development. I suggest you to return soon!**

Made on the top of the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API),
polyfilled with [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) to run in Node.js.

Provide a simple middlewares system, which allows you to build your own chain of operations
to run *before* and *after* a Fetch request.

## Install

### From npm
Just run `yarn add fetchy-js` or `npm install fetchy-js`

### From source

1. Clone this repository
1. I encourage you to use Yarn to install and build. Follow [this guide](https://yarnpkg.com/en/docs/install) to install Yarn.
1. Run `yarn install && yarn build` to compile and transorm it.
1. Your `dist/` is ready!

## Usage

1. Just import it `import { fetch } from "fetchy-js";`
1. And then `fetch("http://something.ext", {});`

Ehi, but it looks really similar to the original Fetch API! fetchy-js can emulate the original Fetch API
if you don't need anything else.

Or... you can use our middlewares (or write your own!)

## Middleware
Middlewares are just simple classes which extend `FetchyMiddleware` and should provide two methods:
- processRequest
- processResponse

Middlewares are resolved from the first to the last _when processing the request_, and from the last to
the first _when processing the response_.

## Setup middlewares
To setup the middlewares chain, you just need to configure it by filling the `middlewares` property of the 3rd
param `fetchyConfig`.
The `middlewares` array is parsed in an ordered way, so to define your own order, just sort the middleware declarations.
That arrat is composed by "declarations". A declaration contains 2 property:
- `class` the middleare class, which should extend `FetchyMiddleware`. it's used by fetchy-js to instantiate the middlware instance.
- `config` an object with the configurations for the middleware.
* All the middlewares are configured in this way. The only exception is the retry one, which is a special middleware.

## Available middlewares

### Retry
**special**
This middleware allows you to setup a retry logic for your HTTP requests! You just need to set the `retry` property of fetchyConfig.
Accepted values are:
- `false` (bool) deactivate the retry logic.
- `true` (bool) enable the retry logic, and use the default config.
- `config` (object) an object which contains the configuration.

#### Retry config object
The config object has 3 properties:
- `attempts`: max number of attempts, default 5.
- `backoff`: to apply the exponential backoff logic, which define the waiting period between 2 attempts, default 2.
- `retriableStatusCodes`: to provide a list of retriable HTTP status codes, can be an Array of numbers or a function which will receive the status code and MUST return a boolean which define if is retriable or not. By default, the middleware will retry if the HTTP status code is >= 500.

### Environment middleware
_coming soon_

### Error interface normalization middleware (ErrorNormalizationMiddleware)
A really simple middleware that doesn't need a config.
It simply catches FetchyError and:
 - If the error contains Errors, it raises a TypeError
 - If the error contains failed Responses, it returns the Response
This middleware has been created for those who want Fetchy to be more [Fetch](https://fetch.spec.whatwg.org/)-compliant.
In case of repeated failures (i.e. with the retry logic enabled), it raises the last error or return the last response.

## Demo
You can find a JS (with webpack) demo project here: https://github.com/savo92/demo-fetchy-js.
Or a Node.js demo inside the `demo/` dir of this repository.

## Write your own middleware
To write you own middleware, just declare a class which extends from `FetchyMiddleware`. Then you have to implement `processRequest` and/or `processResponse` (you can declare both or just one of these).

### processRequest
You need to implement `processRequest` if you want to run something _before_ the Fetch request.
You can alterate the Fetch params or even reject the Promise if you need.
2 things are really important here:
- The method MUST return a Promise by returning `return this.next.processRequest(fetchParams, this);`
- The methos MUST save the `previousMiddleware` in the `previous` object property.
To achieve this 2 important points, just return `return super.processRequest(fetchParams, previousMiddleware);`

### processResponsee
You need to implement `processResponse` if you want to run something _after_ the Fetch request.
You can read the response body but you MUST copy the Response object to not consume the stream.
To continue the middlewares chain, just
`return this.processNextResponse(<a promise which will resolve by returning Response>);`

## Fetch standard
fetchy-js is not 100% [Fetch](https://fetch.spec.whatwg.org/)-compliant.

fetchy-js uses isomorphic-fetch, which uses:
- [node-fetch](https://github.com/bitinn/node-fetch/) on server side
- [GitHub's WHATWG Fetch polyfill](https://github.com/github/fetch) on browsers

### GitHub's WHATWG Fetch polyfill
Officially, GitHub's WHATWG Fetch polyfill is a polyfill that implements a subset of the standard Fetch specification

### node-fetch
node-fetch also isn't 100% Fetch specification-compliant.
There's a list of [known differences](https://github.com/bitinn/node-fetch/blob/master/LIMITS.md)
One of the main differences is that node-fetch throws custom FetchError. fetchy-js is hiding this difference by returning `TypeError` as the Fetch specification says.

### What fetchy-js does to uniform the interface
fetchy-js works also as an interface over node-fetch and Github's WHATWG Fetch polyfill.
One of the most important thing it did is the normalization of the error raising. This means that it doesn't throw `TypeError` nor `FetchError`. Instead, it raises a `FetchyError`, when a network error is occurred or the HTTP status code of the reponse is < 200 or > 299.
Moreover, when the retry logic is enabled, the `FetchyError` (that will be thrown after that all the attempts are failed) will contain ALL the failed Responses or `Error` occurred.

## License
This library is licensed under the MIT license.
