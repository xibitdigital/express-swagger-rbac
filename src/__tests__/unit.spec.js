"use strict";

const { swaggerDocToConf, isAllowed, permitMiddleware } = require("../index");

const swaggerDoc = {
  swagger: "2.0",
  produces: ["application/json"],
  host: "localhost:3001",
  basePath: "/v1",
  paths: {
    "/testfoo/:type/:id": {
      get: {
        tags: ["/foo"]
      },
      rbac: ["group1"]
    },
    "/testfoo/:type/:id/:page": {
      get: {
        "x-swagger-router-controller": "foo",
        operationId: "fooControllerWithPage",
        tags: ["/foo"]
      },
      rbac: ["group1"]
    },
    "/testfoobar": {
      post: {
        "x-swagger-router-controller": "foobar",
        operationId: "foobarController",
        tags: ["/foobar"]
      }
    }
  }
};

const expectedDoc = {
  basePath: "/v1",
  routes: [
    {
      route: "/testfoo/",
      rbac: ["group1"]
    },
    {
      route: "/testfoobar",
      rbac: null
    }
  ]
};

describe("RBAC module", () => {
  describe("swaggerDocToConf", () => {
    it("should return an object to handle RBAC checks", async () => {
      const actualResult = swaggerDocToConf(swaggerDoc);

      expect(actualResult).toEqual(expectedDoc);
    });
  });

  describe("isAllowed", () => {
    it("should return true if the group and route are matching the routes configuration", async () => {
      const req = {
        path: "/v1/testfoo/1/1",
        groups: ["group1"]
      };
      const actualResult = isAllowed(expectedDoc, req);

      expect(actualResult).toEqual(true);
    });

    it("should return true if no rbac is defined", async () => {
      const req = {
        path: "/v1/testfoobar",
        groups: ["group10"]
      };
      const actualResult = isAllowed(expectedDoc, req);

      expect(actualResult).toEqual(true);
    });
  });
});
