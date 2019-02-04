"use strict";

const R = require("ramda");

const swaggerDocToRoutes = R.compose(
  R.uniq,
  R.map(a => ({
    route: a[0].split(":")[0],
    rbac: R.toPairs(a[1])[0][1].rbac ? R.toPairs(a[1])[0][1].rbac : []
  })),
  R.toPairs,
  R.prop("paths")
);

const swaggerDocToConf = swaggerConf => ({
  basePath: swaggerConf.basePath ? swaggerConf.basePath : "",
  routes: swaggerDocToRoutes(swaggerConf)
});

const isAllowed = (config, req) => {
  const noun = config.basePath ? req.path.split(config.basePath)[1] : req.path;
  const matchedRoutes = R.compose(
    R.prop("rbac"),
    R.head,
    R.filter(x => noun.indexOf(x.route) > -1)
  )(config.routes);

  return matchedRoutes === undefined ||
    R.isEmpty(matchedRoutes) ||
    (matchedRoutes && R.intersection(matchedRoutes, req.groups).length > 0)
    ? true
    : false;
};

const permitMiddleware = config => {
  return (req, res, next) => {
    if (req.groups) {
      isAllowed(config, req) ? next() : res.sendStatus(403);
    } else {
      res.sendStatus(200);
    }
  };
};

module.exports = {
  swaggerDocToConf,
  isAllowed,
  permitMiddleware
};
