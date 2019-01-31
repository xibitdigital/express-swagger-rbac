module.exports = function(wallaby) {
  return {
    files: [
      {
        pattern: "node_modules/babel-polyfill/dist/polyfill.js",
        instrument: false
      },
      "src/**/*.js",
      "!test/*.spec.js",
      "!node_modules/**/*.*"
    ],
    tests: ["test/*.spec.js"],
    env: {
      type: "node"
    },
    testFramework: "jest",
    compilers: {
      "src/**/*.js": wallaby.compilers.babel()
    },
    workers: {
      recycle: true
    },
    debug: true
  };
};
