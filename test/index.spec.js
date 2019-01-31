"use strict";

const { test } = require("../src/index");

describe("Sample test", function() {
  it("should return true", function() {
    const data = true;
    const res = test(data);

    expect(res).toEqual(true);
  });

  it("should return false", function() {
    const data = false;
    const res = test(data);

    expect(res).toEqual(false);
  });
});
