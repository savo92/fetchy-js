import { every, isNil, last, map, some } from "lodash";

/*
isomorphic-fecth uses node-fetch, which is not following
the window.Fetch standard (which is for browsers).
Instead, node-fetch raises FetchError.
*/
export type FetchError = Error;

export class FetchyError extends Error {

    private failedResponses: Response[] | null = null;
    private realErrors: Error[] | null = null;

    constructor(message: string, responses?: Response[], errors?: Error[]) {
        super(message);

        Object.setPrototypeOf(this, FetchyError.prototype);

        if (!isNil(responses)) {
            this.saveResponses(responses);
        }
        if (!isNil(errors)) {
            this.saveErrors(errors);
        }

        if (!this.hasResponses() && !this.hasErrors()) {
            throw new Error("Instances of FetchyError without response nor errors are not allowed.");
        }
    }

    get responses(): Response[] | null {
        return this.failedResponses;
    }

    get errors(): Error[] | null {
        return this.realErrors;
    }

    get response(): Response {
        if (!this.hasResponses()) {
            throw new Error("No response to return. You should call this method after hasResponse");
        }

        return last(this.responses)!;
    }

    get error(): Error {
        if (!this.hasErrors()) {
            throw new Error("No error to return. You should call this method after hasErrors");
        }

        return last(this.errors)!;
    }

    public hasResponses(): boolean {
        return this.failedResponses !== null
            && this.failedResponses.length > 0;
    }

    public hasErrors(): boolean {
        return this.realErrors !== null
            && this.realErrors.length > 0;
    }

    private saveResponses(responses: Response[]): void {
        if (some(map(responses, "ok"))) {
            throw new Error("One or more responses is not failed.");
        }

        this.failedResponses = map(responses, (response) => response.clone());
    }

    private saveErrors(errors: Error[]): void {
        if (!every(map(errors, (error: Error) => error instanceof Error))) {
            throw new Error("One or more errors is not instance of Error.");
        }

        const normalizedErrors: Error[] = map(errors, (error: FetchError) => {
            if (error.name === "FetchError") {
                Object.setPrototypeOf(error, TypeError.prototype);
                error.name = "TypeError";
            }

            return error;
        });
        this.realErrors = normalizedErrors;
    }

}
