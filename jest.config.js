module.exports = {
    "moduleDirectories": ["node_modules"],
    "moduleFileExtensions": [
        "ts",
        "js",
        "json"
    ],
    "setupTestFrameworkScriptFile": "<rootDir>/jasmineSetup.js",
    "testPathIgnorePatterns": ["<rootDir>/__tests__/fixtures.ts"],
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts)$",
    "transform": {
        "^.+\\.ts$": "<rootDir>/node_modules/ts-jest/preprocessor.js",
    },
};
