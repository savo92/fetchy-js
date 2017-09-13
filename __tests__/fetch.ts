import { FetchyError } from "../src/utils/error";
import { customFetch } from "../src/utils/fetch";

describe("Custom Fetch errors", () => {

    test("404 => !response.ok", () => {
        expect.assertions(4);

        return customFetch("http://lorenzosavini.com/404")
            .catch((e: FetchyError) => {

                expect(e).toBeInstanceOf(FetchyError);
                expect(e.hasResponses()).toBe(true);
                expect(e.response.ok).toBe(false);
                expect(e.hasErrors()).toBe(false);
            });
    });

    test("Newtork error", () => {
        expect.assertions(4);

        return customFetch("http://something.ext")
            .catch((e: FetchyError) => {

                expect(e).toBeInstanceOf(FetchyError);
                expect(e.hasErrors()).toBe(true);
                expect(e.error).toBeInstanceOf(TypeError);
                expect(e.hasResponses()).toBe(false);
            });
    });

});
