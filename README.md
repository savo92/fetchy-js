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
Just run `yarn add fetchy-js` or `npm install fetch-js`

### From source

1. Clone this repository
1. I encourage you to use Yarn to install and build. Follow [this guide](https://yarnpkg.com/en/docs/install) to install Yarn.-
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

## Setup middlewares
To setup the middlewares chain, you just need to configure it by filling the `middlewares` property of the 3rd
param `fetchyConfig`.
The `middlewares` array is parsed in an ordered way, so to define your own order, just sort the middleware declarations.
That arrat is composed by "declarations". A declaration contains 2 property:
- `class` the middleare class, which should extend `FetchyMiddleware`. it's used by fetchy to instantiate the middlware instance.
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

## Demo
You can find a demo project here: https://github.com/savo92/demo-fetchy-js

## License
This library is licensed under the MIT license.
