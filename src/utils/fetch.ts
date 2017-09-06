// tslint:disable no-import-side-effect

import "isomorphic-fetch";

/*
isomorphic-fecth uses node-fetch, which is not following
the window.Fetch standard (which is for browsers).
Instead, node-fetch raises FetchError.
*/
export type FetchError = Error;

export const castToTypeError = (error: FetchError | TypeError | Error) => {
    // @TODO consider to use the FetchError stack
    Object.setPrototypeOf(error, TypeError.prototype);
    error.name = TypeError.prototype.name;

    return error;
};

export const customFetch = async (input: RequestInfo, init: RequestInit) =>
    fetch(input, init)
        .catch((e: FetchError | TypeError) => {
            throw castToTypeError(e);
        });
