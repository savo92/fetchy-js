const fetch = require("../dist/index").fetch;

console.log(fetch);
fetch("https://something.ext", {}, { middlewares: [], retry: true })
    .then((r) => {
        r.text().then((t) => console.log(t));
    })
    .catch((error) => {
        console.error(error);
    });
