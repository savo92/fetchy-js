import {
    drop,
    every,
    first,
    has,
    isNil,
    map,
    reverse,
} from "lodash";

import {
    IFetchParams,
    IFetchyChain,
    IFetchyMiddleware,
    IFetchyMiddlewareDeclaration,
} from "./middlewares/base";
import { FetchFakeMiddleware } from "./middlewares/fetch";
import {
    getRetryMiddlewareDeclaration,
    IFetchyRetryMiddlewareConfig,
} from "./middlewares/retry";

export interface IFetchyConfig {
    middlewares?: Array<IFetchyMiddlewareDeclaration<IFetchyMiddleware>>;
    retry: IFetchyRetryMiddlewareConfig | boolean;
}

export const validateMiddlewareDeclarations = (
    middlewares: Array<IFetchyMiddlewareDeclaration<IFetchyMiddleware>>,
): boolean => {

    return every(map(middlewares, (middlewareDeclaration: IFetchyMiddlewareDeclaration<IFetchyMiddleware>) =>

        has(middlewareDeclaration, "config")
            && !isNil(middlewareDeclaration.class),

    ));

};

const validateFetchyConfig = (
    fetchyConfig: IFetchyConfig,
): Array<IFetchyMiddlewareDeclaration<IFetchyMiddleware>> | null => {

    if (isNil(fetchyConfig.middlewares)) {
        return [];
    }

    return validateMiddlewareDeclarations(fetchyConfig.middlewares)
        ? fetchyConfig.middlewares
        : null;
};

const instanceFetchyMiddleware = (
    middlewareClass,
    middlewareConfig,
    nextRing,
): IFetchyMiddleware => {

    if (nextRing === null) {
        nextRing = new FetchFakeMiddleware({}, null);
    }

    return new middlewareClass(
        middlewareConfig,
        nextRing,
    );

};

const buildChainRings = (
    middlewareDeclaration: IFetchyMiddlewareDeclaration<IFetchyMiddleware>,
    nextRing: IFetchyMiddleware | null,
    remainingMiddlewareDeclarations: Array<IFetchyMiddlewareDeclaration<IFetchyMiddleware>>,
): IFetchyMiddleware => {

    const ring = instanceFetchyMiddleware(
        middlewareDeclaration.class,
        middlewareDeclaration.config,
        nextRing,
    );

    if (remainingMiddlewareDeclarations.length > 0) {
        return buildChainRings(
            first(remainingMiddlewareDeclarations)!,
            ring,
            drop(remainingMiddlewareDeclarations, 1),
        );
    }

    return ring;

};

export const buildChain = (fetchyConfig: IFetchyConfig): IFetchyChain | null  => {

    const middlewareDeclarations = validateFetchyConfig(fetchyConfig);
    if (middlewareDeclarations === null) {
        throw new Error("middlewares object is not valid");
    }

    const retryMiddlewareDeclaration = getRetryMiddlewareDeclaration(fetchyConfig.retry);
    if (retryMiddlewareDeclaration !== null) {
        middlewareDeclarations.push(retryMiddlewareDeclaration);
    }

    if (middlewareDeclarations.length === 0) {
        return null;
    }
    const reversedMiddlewareDeclarations = reverse(middlewareDeclarations);

    return {
        start: buildChainRings(
            first(reversedMiddlewareDeclarations),
            null,
            drop(reversedMiddlewareDeclarations),
        ),
    };

};

export const executeChain = async (
    chain: IFetchyChain,
    fetchParams: IFetchParams,
): Promise<Response> => {

    return chain.start.processRequest(fetchParams, null);
};
