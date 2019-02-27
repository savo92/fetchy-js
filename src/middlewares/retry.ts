import {
    cloneDeep,
    find,
    isArray,
    isFunction,
    isUndefined,
    merge,
} from "lodash";

import { FetchyError } from "../utils/error";
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

export class FetchyRetryMiddleware extends FetchyMiddleware {
    protected config: IFetchyRetryMiddlewareConfig;
    private attemptsCount = 0;
    private fetchParamsClone: IFetchParams;
    private failedResponses: Response[] = [];
    private errors: Error[] = [];

    constructor(config: IFetchyRetryMiddlewareConfig, next) {
        // @TODO missing "config" validation
        super(config, next);
    }

    public async processRequest(
        fetchParams: IFetchParams,
        previousMiddleware: FetchyMiddleware | null,
    ): Promise<Response> {
        this.fetchParamsClone = cloneDeep(fetchParams);

        return super.processRequest(fetchParams, previousMiddleware);
    }

    public async processResponse(promise0: Promise<Response>): Promise<Response> {
        return promise0
            .then(async (response: Response) => {
                if (!response.ok) {
                    throw new Error("The request is failed. This shouldn't happen.");
                }

                return this.processNextResponse(new Promise((resolve) => {
                    resolve(response);
                }));
            })
            .catch(async (e: FetchyError) => {

                const canRetry = e instanceof FetchyError
                    && (
                        e.hasErrors()
                        || (e.hasResponses() && this.isRetriableCode(e.response.status))
                    );

                if (canRetry) {

                    if (e.hasErrors()) {
                        this.errors = merge(this.errors, e.errors);
                    }
                    if (e.hasResponses()) {
                        this.failedResponses = merge(this.failedResponses, e.responses);
                    }

                    this.attemptsCount++;
                    if (this.attemptsCount >= this.config.attempts) {
                        throw new FetchyError(
                            `Too many failures (${this.fetchParamsClone.input})`,
                            this.failedResponses,
                            this.errors,
                        );
                    }

                    return new Promise<Response>((resolve) => {
                        const seconds = Math.pow(this.config.backoff, this.attemptsCount) * 1000;
                        setTimeout(() => {
                            resolve(this.processRequest(this.fetchParamsClone, this.previous));
                        }, seconds);
                    });

                }
                throw e;

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
