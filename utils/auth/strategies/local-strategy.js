const { Strategy } = require("passport-local");
const userService = require("./../../../routes/services/user_services");
const boom = require("@hapi/boom");
const bcrypt = require("bcrypt");

const service = new userService();

const LocalStrategy = new Strategy(async (username, password, done) => {
  try {
    const user = await service.consultar_user(username);
    console.log(user);

    if (user == "") {
      // done(boom.unauthorized(), false)
      done(
        {
          ok: false,
          message: "Usuario o password incorrecta",
        }
      );
    }
    const verify = await bcrypt.compare(password, user[0].password);
    console.log(verify);
    if (!verify) {
      // done(boom.unauthorized(), false)
      done(
        {
          ok: false,
          message: "Usuario o password incorrecta",
        }
      );
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

module.exports = LocalStrategy;
