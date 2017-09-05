import {
    validateMiddlewareDeclarations
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
