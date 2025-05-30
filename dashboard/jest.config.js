module.exports = {
  transform: {
    "^.+\\.jsx?$": "<rootDir>/jest-preprocess.js",
    "\\.svg$": "<rootDir>/jest-svg-transformer.js",
  },
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$": "identity-obj-proxy",
  },
  testPathIgnorePatterns: ["node_modules", ".cache", "public", "e2e"],
  transformIgnorePatterns: ["node_modules/(?!(gatsby)/)"],
  globals: {
    __PATH_PREFIX__: "",
  },
  setupFilesAfterEnv: ["<rootDir>/setup-test-env.js"],
  clearMocks: true,
  preset: "ts-jest",
  testEnvironment: "jsdom",
};

process.env = Object.assign(process.env, {
  DEPLOYMENT_ENV: "TEST_ENV",
});
