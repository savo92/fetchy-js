import { isNil } from "lodash";

import {
    buildChain,
    executeChain,
    IFetchyConfig,
} from "./chain";
import {
    FetchyMiddleware,
} from "./middlewares/base";
import {
    fetch,
} from "./utils/fetch";

export {
    FetchyMiddleware,
    IFetchyConfig,
};

export const fetchy = (
    input: RequestInfo,
    init: RequestInit,
    fetchyConfig: IFetchyConfig | undefined,
): Promise<Response> => {

    if (!isNil(fetchyConfig)) {

        const chain = buildChain(fetchyConfig);
        return executeChain(chain, { input, init });

    }

    // In the case that fetchyConfig is missing, just call fetch
    return fetch(input, init);

};
