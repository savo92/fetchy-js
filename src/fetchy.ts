import { isNil } from "lodash";
import {
    buildChain,
    executeChain,
} from "./chain";
import { IFetchyConfig } from "./chain";

export {
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

    return fetch(input, init);

};
