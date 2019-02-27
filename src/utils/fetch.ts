// tslint:disable no-import-side-effect

import "isomorphic-fetch";

import { FetchError, FetchyError } from "./error";

export const customFetch = async (input: RequestInfo, init?: RequestInit) =>
    fetch(input, init)
        .then((response: Response): Response => {
            if (!response.ok) {
                throw new FetchyError(
                    `Fetch request failed with status ${response.status} (${input})`,
                    [response],
                );
            }

            return response;
        })
        .catch((error: FetchyError | FetchError | TypeError) => {
            if (error instanceof FetchyError) {
                throw error;
            }

            throw new FetchyError(
                `An error has been catched (${input})`,
                undefined,
                [error],
            );
        });
