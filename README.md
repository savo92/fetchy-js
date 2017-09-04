# fetchy-js
> Just another AJAX/HTTP library

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
