// tslint:disable-next-line no-import-side-effect
import "isomorphic-fetch";
import { map, range } from "lodash";

import { makeFakeResponse } from "./fixtures";

import { FetchError, FetchyError } from "../src/utils/error";

describe("FecthyError responses validation", () => {

    test("All failed responses", () => {

        const e = new FetchyError(
            "some msg",
            map(range(5), () => makeFakeResponse(false)),
        );
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(FetchyError);

        expect(e.hasResponses()).toBe(true);
        expect(e.hasErrors()).toBe(false);
        expect(e.responses).toHaveLength(5);

    });

    test("A not failed response", () => {

        const responses = map(range(5), () => makeFakeResponse(false));
        responses.push(makeFakeResponse(true));

        expect(() =>
            new FetchyError(
                "some msg",
                responses,
            ),
        ).toThrow("One or more responses is not failed.");

    });

});

describe("FecthyError errors validation", () => {

        test("All errors", () => {

            const e = new FetchyError(
                "some msg",
                undefined,
                map(range(5), () => new Error("some msg")),
            );
            expect(e).toBeDefined();
            expect(e).toBeInstanceOf(FetchyError);

            expect(e.hasErrors()).toBe(true);
            expect(e.hasResponses()).toBe(false);
            expect(e.errors).toHaveLength(5);

        });

        test("A not failed response", () => {

            const errors = map(range(5), () => new Error("some msg"));
            errors.push(null);

            expect(() =>
                new FetchyError(
                    "some msg",
                    undefined,
                    errors,
                ),
            ).toThrow("One or more errors is not instance of Error.");

        });

    });
