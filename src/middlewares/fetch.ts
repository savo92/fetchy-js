import {
    fetch,
} from "../utils/fetch";

import {
    FetchyMiddleware,
    IFetchParams,
} from "./base";

export class FetchFakeMiddleware extends FetchyMiddleware {

    public processRequest(
        fetchParams: IFetchParams,
        previousMiddleware: FetchyMiddleware,
    ): Promise<Response> {
        return previousMiddleware.processResponse(fetch(fetchParams.input, fetchParams.init));
    }
}
