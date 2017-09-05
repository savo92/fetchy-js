import {
    fetchy,
    IFetchyRetryMiddlewareConfig,
} from "../src/fetchy";

describe("Test retry logic", () => {

    test("Failure with client error", () => {
        expect.assertions(1);

        const retryConfig: IFetchyRetryMiddlewareConfig = {
            attempts: 4,
            backoff: 1,
            retriableStatusCodes: (statusCode: number) => statusCode >= 400 && statusCode < 500,
            retryNetworkErrors: false,
        };
        return fetchy("http://lorenzosavini.com/404", {}, { middlewares: [], retry: retryConfig })
            .catch((e) => expect(e.message).toMatch(/failed 4 times/));

    });

    test("Failure with network error", () => {
        expect.assertions(1);

        const retryConfig: IFetchyRetryMiddlewareConfig = {
            attempts: 4,
            backoff: 1,
            retriableStatusCodes: (statusCode: number) => statusCode > 599,
            retryNetworkErrors: true,
        };
        return fetchy("http://something.ext", {}, { middlewares: [], retry: retryConfig })
            .catch((e) => expect(e.message).toMatch(/failed 4 times/));

    });

});
