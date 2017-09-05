import {
    fetchy,
    IFetchyConfig,
} from "./src/fetchy";

export {
    IFetchyConfig,
};

/**
 * The Fetchy API.
 *
 * @param {RequestInfo} input
 * @param {RequestInit} init
 * @param {IFetchyConfig|undefined} fetchyConfig
 */
export const fetch = (
    input: RequestInfo,
    init: RequestInit,
    fetchyConfig: IFetchyConfig | undefined,
): Promise<Response>  => {

    return fetchy(input, init, fetchyConfig);

};
