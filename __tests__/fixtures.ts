// tslint:disable no-let no-any

export const makeFakeResponse = (ok: boolean): Response => {

    let msg: any = "";
    let init: ResponseInit = {};
    if (ok) {
        msg = "some useless successful body";
        init = { status: 200 };
    } else {
        msg = "some useless failed body";
        init = { status: 500 };
    }

    return new Response(msg, init);

};
