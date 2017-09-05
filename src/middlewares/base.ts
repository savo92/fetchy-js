import {
    isNil,
} from "lodash";

export interface IFetchParams {
    input: RequestInfo;
    init: RequestInit;
}

// tslint:disable-next-line no-empty-interface
export interface IFetchyMiddlewareConfig {}

export interface IFetchyChain {
    start: IFetchyMiddleware;
}

export interface IFetchyMiddleware {
    processRequest: (fetchParams: IFetchParams, previousMiddleware: FetchyMiddleware | null) => Promise<Response>;
    processResponse: (response: Promise<Response>) => Promise<Response>;
}

export interface IFetchyMiddlewareDeclaration {
    class: IFetchyMiddleware;
    config: IFetchyMiddlewareConfig;
}

export abstract class FetchyMiddleware implements IFetchyMiddleware {
    protected readonly config: IFetchyMiddlewareConfig;
    protected readonly next: FetchyMiddleware | null;
    protected previous: FetchyMiddleware | null;

    constructor(config: IFetchyMiddlewareConfig, nextMiddleware: FetchyMiddleware | null) {
        this.config = config;
        this.next = nextMiddleware;
    }

    public processRequest(
        fetchParams: IFetchParams,
        previousMiddleware: FetchyMiddleware,
    ): Promise<Response> {

        this.previous = previousMiddleware;
        return this.next!.processRequest(fetchParams, this);
    }

    public processResponse(promise0: Promise<Response>): Promise<Response> {
        return this.processNextResponse(promise0);
    }

    protected processNextResponse(promise: Promise<Response>): Promise<Response> {
        if (!isNil(this.previous)) {
            return this.previous.processResponse(promise);
        }
        return promise;
    }

}
