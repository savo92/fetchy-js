import { FetchyError } from "../utils/error";
import { FetchyMiddleware } from "./base";

export class ErrorNormalizationMiddleware extends FetchyMiddleware {

    public async processResponse(promise0: Promise<Response>): Promise<Response> {
        return promise0
            .catch(async (e: FetchyError) => {
                if (e.hasErrors()) {
                    throw new TypeError(e.error.message);
                }

                return this.processResponse(new Promise((resolve) => {
                    resolve(e.response);
                }));
            });
    }

}
