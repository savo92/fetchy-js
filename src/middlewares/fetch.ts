import "isomorphic-fetch";

import FetchyMiddleware, {
    IFetchParams,
} from "./base";

export default class FetchFakeMiddleware extends FetchyMiddleware {

    public processRequest(fetchParams: IFetchParams, previousMiddleware: FetchyMiddleware) {
        return previousMiddleware.processResponse(fetch(fetchParams.input, fetchParams.init));
    }
}
