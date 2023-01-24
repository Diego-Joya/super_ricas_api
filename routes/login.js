const expres = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const autservices = require("./services/auth_service");


const service = new autservices();


const { config } = require("./../config/config");

const router = expres.Router();

router.post(
  "/",
  passport.authenticate("local", { session: false }),
  async (req, res, next) => {
    const jwtConfig = {
      expiresIn: "2h",
    };
    try {
      const user = req.user;
      const payload = {
        sub: user[0].id,
        role: user[0].id_profile,
      };
      data = user[0];
      delete data.password;
      const token = jwt.sign(payload, config.jwtsecret, jwtConfig);
      data.token = token;

      res.json({
        ok: true,
        data,
      });
    } catch (error) {
      // next(error);
      res.json({
        ok: false,
        message: "Ups error al ingresar",
      });
    }
  }
);

router.post(
  "/recovery",
  async (req, res, next) => {
    
    try {
      const email = req.body.email;
     const rta= await service.resetPasswor(email)
     console.log(rta);

      res.json(rta);
    } catch (error) {
      next(error);
      // res.json({
      //   ok: false,
      //   message: "Ups error al ingresar",
      // });
    }
  }
);

module.exports = router;
