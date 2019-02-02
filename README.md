# Swagger RBAC middleware

Simple middleware with RBAC on JSON swagger document

```javascript
{
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
```

If the RABC role is defined in the route the middleware will match it with what's defined in `req.groups`.

Example:

```javascript
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

const config = swaggerDocToConf(swaggerDoc);

app.use((req, res, next) => {
 req.groups = ["group1"];// adding groups to req
 next();
});

// setting middleware
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
```








