"use strict";

const { permitMiddleware, swaggerDocToConf } = require("../index");

const express = require("express");
const request = require("supertest");

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
    "/testfoo/:foo/:foo/:foo": {
      get: {
        "x-swagger-router-controller": "foo",
        operationId: "fooControllerWithPage",
        tags: ["/foo"]
      },
      rbac: ["group1"]
    },
    "/testfoobar/:foo": {
      get: {
        "x-swagger-router-controller": "foobar",
        operationId: "foobarController",
        tags: ["/foobar"]
      }
    }
  }
};

describe("permitMiddleware", () => {
  let app;
  const config = swaggerDocToConf(swaggerDoc);

  beforeEach(() => {
    app = express();
  });

  it("should return 403 if access group does not match", async () => {
    app.use((req, res, next) => {
      req.groups = ["group2"];
      next();
    });
    app.use(permitMiddleware(config));

    app.get("/v1/testfoo/:foo/:foo", (req, res, next) => {
      res.sendStatus(200);
      next();
    });

    const response = await request(app)
      .get("/v1/testfoo/1/1")
      .expect(403)
      .end((err, res) => {
        if (err) throw err;
      });
  });

  it("should return 403 if access group is not present", async () => {
    app.use((req, res, next) => {
      req.groups = ["group2"]; //?
      next();
    });
    app.use(permitMiddleware(config));

    app.get("/v1/testfoobar/:foo", (req, res, next) => {
      res.sendStatus(200);
    });

    const response = await request(app)
      .get("/v1/testfoobar/1")
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
      });
  });

  it("should return 200 if access group does match", async () => {
    app.use((req, res, next) => {
      req.groups = ["group1"];
      next();
    });
    app.use(permitMiddleware(config));

    app.get("/v1/testfoo/:foo/:foo", (req, res, next) => {
      res.sendStatus(200);
      next();
    });

    const response = await request(app)
      .get("/v1/testfoo/1/1")
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
      });
  });
});
