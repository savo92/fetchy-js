import {
    fetchy,
    IFetchyConfig,
} from "./src/fetchy";

export {
    IFetchyConfig,
};

/**
 *
 * @param {RequestInfo} input
 * @param {RequestInit} init
 * @param {IFetchyConfig|undefined} fetchyConfig
 */
export function fetch(
    input: RequestInfo,
    init: RequestInit,
    fetchyConfig: IFetchyConfig | undefined,
): Promise<Response> {

    return fetchy(input, init, fetchyConfig);

}
