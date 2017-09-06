import {
    fetchy,
    IFetchyRetryMiddlewareConfig,
} from "../src/fetchy";

describe("Test retry logic", () => {

    test("Failure with client error", () => {
        expect.assertions(2);

        const retryConfig: IFetchyRetryMiddlewareConfig = {
            attempts: 4,
            backoff: 1,
            retriableStatusCodes: (statusCode: number) => statusCode >= 400 && statusCode < 500,
            retryNetworkErrors: false,
        };
        return fetchy("http://lorenzosavini.com/404", {}, { middlewares: [], retry: retryConfig })
            .catch((e) => {
                expect(e.message).toMatch(/failed 4 times/);
                expect(e.name).toMatch("TypeError");
            });

    });

    test("Failure with network error", () => {
        expect.assertions(2);

        const retryConfig: IFetchyRetryMiddlewareConfig = {
            attempts: 4,
            backoff: 1,
            retriableStatusCodes: (statusCode: number) => statusCode > 599,
            retryNetworkErrors: true,
        };
        return fetchy("http://something.ext", {}, { middlewares: [], retry: retryConfig })
            .catch((e) => {
                expect(e.message).toMatch(/failed 4 times/);
                expect(e.name).toMatch("TypeError");
            });

    });

});

describe("Default retry configuration", () => {

    test("Failure with client error", () => {
        expect.assertions(2);
        return fetchy("http://lorenzosavini.com/404", {}, { middlewares: [], retry: true })
            .catch((e) => {
                expect(e.message).toMatch(/failed with 404/);
                expect(e.name).toMatch("TypeError");
            });

    });

    test("Failure with network error", () => {
        expect.assertions(1);

        return fetchy("http://something.ext", {}, { middlewares: [], retry: true })
            .catch((e) => {
                expect(e.name).toMatch("TypeError");
            });

    });

});
