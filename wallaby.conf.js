module.exports = function(wallaby) {
  return {
    files: ["src/**/*.js", "!src/**/__tests__/*.js", "!node_modules/**/*.*", "!coverage/**/*.*"],
    tests: ["src/**/__tests__/*.js"],
    env: {
      type: "node"
    },
    testFramework: "jest",
    workers: {
      recycle: true
    },
    debug: false
  };
};
