module.exports = {
  transform: {
    "^.+\\.jsx?$": "<rootDir>/jest-preprocess.js",
  },
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$": "identity-obj-proxy",
  },
  testPathIgnorePatterns: ["node_modules", ".cache", "public"],
  transformIgnorePatterns: ["node_modules/(?!(gatsby)/)"],
  globals: {
    __PATH_PREFIX__: "",
  },
  setupFilesAfterEnv: ["<rootDir>/setup-test-env.js"],
};
