CHANGELOG
=========

## v0.0.1
First release. Basic setup works and allows to setup the retry logic only

## v0.0.2
Fix retry middleware, which wasn't failing properly when it reached max attempts.

## v0.0.3
Improving Fetch specification-compliance by throwing TypeError instead of FetchError (on Node.js)
