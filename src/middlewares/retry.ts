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
}

const DEFAULT_RETRY_CONFIG: IFetchyRetryMiddlewareConfig = {
    attempts: 5,
    backoff: 2,
    retriableStatusCodes: (statusCode: number) => statusCode >= 500,
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
        previousMiddleware: FetchyMiddleware,
    ): Promise<Response> {
        this.fetchParamsClone = cloneDeep(fetchParams);
        return super.processRequest(fetchParams, previousMiddleware);
    }

    public processResponse(promise0: Promise<Response>): Promise<Response> {
        return promise0.then((response: Response) => {

            if (response.ok === true) {
                return this.processNextResponse(new Promise((resolve) => {
                    resolve(response);
                }));
            }

            if (!this.isRetriableCode(response.status)) {
                throw new Error();  // @TODO define properly failure way
            }

            this.attemptsCount++;
            if (this.attemptsCount >= this.config.attempts) {
                throw new Error();  // @TODO define properly failure way
            }

            return new Promise<Response>((resolve) => {
                const seconds = Math.pow(this.config.backoff, this.attemptsCount) * 1000;
                setTimeout(() => {
                    this.processRequest(this.fetchParamsClone, this.previous)
                        .then((newResponse) => resolve(newResponse));
                }, seconds);

            });

        });
    }

    private isRetriableCode(statusCode: number): boolean {
        if (isArray(this.config.retriableStatusCodes)) {
            return !isUndefined(find(this.config.retriableStatusCodes, statusCode));
        }

        if (isFunction(this.config.retriableStatusCodes)) {
            return this.config.retriableStatusCodes(statusCode);
        }
    }

}
