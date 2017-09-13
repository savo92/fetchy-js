module.exports = {
    "testPathIgnorePatterns": ["<rootDir>/__tests__/fixtures.ts"],
    "transform": {
        "^.+\\.ts$": "<rootDir>/node_modules/ts-jest/preprocessor.js",
        "\\.js$": "<rootDir>/node_modules/babel-jest",
    },
    "globals": {
        "ts-jest": {
            "useBabelrc": true,
        },
    },
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts)$",
    "moduleFileExtensions": [
        "ts",
        "js",
        "json"
    ],
    "setupTestFrameworkScriptFile": "<rootDir>/jasmineSetup.js",
}
