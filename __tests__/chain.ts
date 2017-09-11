import {
    buildChain,
    validateMiddlewareDeclarations,
} from "../src/chain";

describe("Test middleware declarations validation", () => {

    test("No class", () => {

        const middls = [
            {
                class: null,
                config: {},
            },
        ];

        expect(validateMiddlewareDeclarations(middls)).toBeFalsy();

    });

});

describe("Test fetchyConfig", () => {

    test("Only retry", () => {

        expect(buildChain({ retry: true })).toBeDefined();

        const fetchyConfig = {
            retry: {
                attempts: 1,
                backoff: 1,
                retriableStatusCodes: [500],
                retryNetworkErrors: false,
            }
        };
        expect(buildChain(fetchyConfig)).toBeDefined();

    });

    test("Nothing", () => {
        expect(buildChain({ retry: false })).toBeNull();

    });

});
