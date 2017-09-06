import * as fetchUtils from "../utils/fetch";

import {
    FetchyMiddleware,
    IFetchParams,
} from "./base";

export class FetchFakeMiddleware extends FetchyMiddleware {

    public async processRequest(
        fetchParams: IFetchParams,
        previousMiddleware: FetchyMiddleware,
    ): Promise<Response> {

        return  previousMiddleware.processResponse(
            fetchUtils.customFetch(fetchParams.input, fetchParams.init),
        );
    }

}
