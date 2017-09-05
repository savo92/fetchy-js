// tslint:disable no-import-side-effect

import "isomorphic-fetch";

// tslint:disable-next-line no-any
declare var global: any;

const fetch = global.fetch;

export {
    fetch,
};
