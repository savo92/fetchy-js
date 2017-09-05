import {
    cloneDeep,
    find,
    isArray,
    isFunction,
    isUndefined,
} from "lodash";

import {
    FetchyMiddleware,
    IFetchParams,
    IFetchyMiddlewareConfig,
    IFetchyMiddlewareDeclaration,
} from "./base";

export interface IFetchyRetryMiddlewareConfig extends IFetchyMiddlewareConfig {
    attempts: number;
    backoff: number;
    retriableStatusCodes: ((statusCode: number) => boolean) | number[];
    retryNetworkErrors: boolean;
}

const DEFAULT_RETRY_CONFIG: IFetchyRetryMiddlewareConfig = {
    attempts: 5,
    backoff: 2,
    retriableStatusCodes: (statusCode: number) => statusCode >= 500,
    retryNetworkErrors: false,
};

export const getRetryMiddlewareDeclaration = (
    retry: IFetchyRetryMiddlewareConfig | boolean,
): IFetchyMiddlewareDeclaration | null => {

    if (retry === false) {
        return null;
    }

    const config = retry === true ? DEFAULT_RETRY_CONFIG : retry;
    return {
        // tslint:disable-next-line no-any
        class: (FetchyRetryMiddleware as any),  // Sorry
        config,
    };

};

export class FetchyRetryMiddleware extends FetchyMiddleware {
    protected config: IFetchyRetryMiddlewareConfig;
    private attemptsCount = 0;
    private fetchParamsClone: IFetchParams;

    constructor(config: IFetchyRetryMiddlewareConfig, next) {
        // @TODO missing "config" validation
        super(config, next);
    }

    public processRequest(
        fetchParams: IFetchParams,
        previousMiddleware: FetchyMiddleware | null,
    ): Promise<Response> {
        this.fetchParamsClone = cloneDeep(fetchParams);
        return super.processRequest(fetchParams, previousMiddleware);
    }

    public processResponse(promise0: Promise<Response>): Promise<Response> {
        return promise0
            .then((response: Response) => {

                if (response.ok === true) {
                    return this.processNextResponse(new Promise((resolve) => {
                        resolve(response);
                    }));
                }

                if (!this.isRetriableCode(response.status)) {
                    throw new Error(
                        `Failed to fetch: request to ${response.url} failed with ${response.status}`,
                    );
                }

                return this.tryToRetry(
                    `Failed to fetch: request to ${response.url} failed ${this.attemptsCount+1} times.`
                    + `Last HTTP status code: ${response.status}`,
                );

            })
            .catch((e: Error) => {

                if (this.config.retryNetworkErrors === true && e.name === "FetchError") {
                    return this.tryToRetry(
                        `Failed to fetch: request failed ${this.attemptsCount+1} times.`
                        + `Last error: ${e.name}: ${e.message}`,
                    );
                }
                throw e;

            });
    }

    private tryToRetry(failureMessage: string): Promise<Response> {
        this.attemptsCount++;
        if (this.attemptsCount >= this.config.attempts) {
            throw new Error(failureMessage);
        }

        return new Promise<Response>((resolve) => {
            const seconds = Math.pow(this.config.backoff, this.attemptsCount) * 1000;
            setTimeout(() => {
                resolve(this.processRequest(this.fetchParamsClone, this.previous));
            }, seconds);

        });
    }

    private isRetriableCode(statusCode: number): boolean {
        if (isArray(this.config.retriableStatusCodes)) {
            return !isUndefined(find(this.config.retriableStatusCodes, statusCode));
        }

        if (isFunction(this.config.retriableStatusCodes)) {
            return this.config.retriableStatusCodes(statusCode);
        }

        throw new TypeError(
            "Retry config property \"retriableStatusCodes\" is not an array or a function",
        );
    }

}
