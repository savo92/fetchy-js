import {
    ErrorNormalizationMiddleware,
    fetchy,
    IFetchyRetryMiddlewareConfig,
} from "../src/fetchy";
import { FetchyError } from "../src/utils/error";

describe("Error normalization without retry", () => {

    test("Must return a Response with ok !== true", () => {
        expect.assertions(1);

        return fetchy("http://lorenzosavini.com/404", {}, {
                middlewares: [
                    {
                        class: ErrorNormalizationMiddleware,
                        config: {},
                    },
                ],
                retry: false,
            })
            .then((response: Response) => {
                expect(response.ok).toBe(false);
            });

    });

    test("Must throw a TypeError", () => {
        expect.assertions(1);

        return fetchy("http://something.ext", {}, {
                middlewares: [
                    {
                        class: ErrorNormalizationMiddleware,
                        config: {},
                    },
                ],
                retry: false,
            })
            .catch((e: TypeError) => {
                expect(e).toBeInstanceOf(TypeError);
            });

    });

});
