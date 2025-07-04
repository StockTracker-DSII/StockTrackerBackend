// jest.config.js
module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text", "text-summary"],
  testMatch: ["**/*.test.js"],
};
