import { isNil } from "lodash";

import {
    buildChain,
    executeChain,
    IFetchyConfig,
} from "./chain";
import { FetchyMiddleware } from "./middlewares/base";
import { ErrorNormalizationMiddleware } from "./middlewares/errorNormalization";
import { IFetchyRetryMiddlewareConfig } from "./middlewares/retry";
import { customFetch } from "./utils/fetch";

export {
    ErrorNormalizationMiddleware,
    FetchyMiddleware,
    IFetchyConfig,
    IFetchyRetryMiddlewareConfig,
};

export const fetchy = async (
    input: RequestInfo,
    init: RequestInit,
    fetchyConfig: IFetchyConfig | undefined,
): Promise<Response> => {

    if (!isNil(fetchyConfig)) {
        const chain = buildChain(fetchyConfig);

        if (chain !== null) {
            return executeChain(chain, { input, init });
        }
    }

    // In the case that fetchyConfig is missing or chain is null, just call fetch
    return customFetch(input, init);

};
