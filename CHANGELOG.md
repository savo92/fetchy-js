CHANGELOG
=========

## v0.0.1
First release. Basic setup works and allows to setup the retry logic only

## v0.0.2
Fix retry middleware, which wasn't failing properly when it reached max attempts.

## v0.0.3
Improving Fetch specification-compliance by throwing TypeError instead of FetchError (on Node.js)

## v0.0.4
Fix module when imported in a Typescript project

## v0.0.5
Ship source code

## v0.0.6
Make middlewares optional

## v0.0.7
Errors normalization by introducing `FetchyError`

## v0.0.8
New Middleware to normalize FetchyErrors, to be Fetch-compliant.

## v0.0.9
Remove Babel and start using Webpack, compile TS to ES6, ES5 and UMD bundle. Stop shipping `src` in NPM package.

## v0.0.10
Expose `FetchyError` type.
