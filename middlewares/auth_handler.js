// const boom = require("@hapi/boom");
const { config } = require("./../config/config");

function checkApiKey(req, res, next) {
  const apiKey = req.headers["api"];
  console.log(apiKey);
  console.log(config.apiKey);
  try {
    if (apiKey == config.apiKey) {
      next();
    } else {
    //   next(boom.unauthorized());
    }
  } catch (error) {
    console.log(error);
  }
}

function checkAdminRole(req, res, next) {
  try {
    const user = req.user;
    if (user.role == 1) {
      next();
    } else {
    //   next(boom.unauthorized());
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = { checkApiKey, checkAdminRole };
