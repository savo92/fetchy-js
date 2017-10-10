import {
    ErrorNormalizationMiddleware,
    fetchy,
    FetchyMiddleware,
    IFetchyConfig,
    IFetchyRetryMiddlewareConfig,
} from "./src/fetchy";

export {
    ErrorNormalizationMiddleware,
    FetchyMiddleware,
    IFetchyConfig,
    IFetchyRetryMiddlewareConfig,
};

/**
 * The Fetchy API.
 *
 * @param {RequestInfo} input
 * @param {RequestInit} init
 * @param {IFetchyConfig|undefined} fetchyConfig
 */
export const fetch = async (
    input: RequestInfo,
    init: RequestInit,
    fetchyConfig: IFetchyConfig | undefined,
): Promise<Response>  => {

    return fetchy(input, init, fetchyConfig);

};
