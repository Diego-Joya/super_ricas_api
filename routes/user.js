const expres = require("express");
// const { check } = require("express-validator");
// const { validateRoutes } = require("../utils/validateRoutes");
// const { validateUsers } = require("../controllers/auth");
const userService = require("./services/user_services");
// const boom = require("@hapi/boom");
const bcrypt = require("bcrypt");

const passport = require("passport");

const {
  create_schema,
  update_schema,
  get_schema,
  delete_schema,
} = require("../schema/user_schame");
const validatorHandler = require("./../middlewares/validator_handler");

const router = expres.Router();

const service = new userService();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const productos = await service.buscar_todos();
      res.json({
        ok: true,
        data: productos,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:nombre",
  passport.authenticate("jwt", { session: false }),
  validatorHandler(get_schema, "params"),
  async (req, res, next) => {
    try {
      const { nombre } = req.params;
      const dat = await service.buscar_uno(nombre);
      res.json({
        ok: true,
        data: dat,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  // passport.authenticate('jwt', { session: false}),
  validatorHandler(create_schema, "body"),
  async (req, res) => {
    const body = req.body;
    console.log(body);
    const validar = await service.validar_user(body.user);
    if (validar != false) {
      res.json({
        ok: false,
        message: "Este usuario ya existe!",
      });
    } else {
      const crear = await service.crear(body);
      delete crear[0].password;

      res.json({
        ok: true,
        message: "Registro creado correctamente!",
        data: crear,
      });
    }
  }
);
router.post(
  "/password/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const body = req.body;
    const id = body.id;
    const consul = await service.consulta_password(id);
    console.log(consul);
    let passport = consul[0].password;
    const verify = await bcrypt.compare(body.password, passport);
    console.log(verify);
    if (verify) {
      res.json({
        ok: true,
        message: "Password correcta!",
      });
    } else {
      res.json({
        ok: false,
        message: "Password incorrecto!",
      });
    }
  }
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validatorHandler(update_schema, "body"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const actualizar = await service.actualizar(id, body);
      if (actualizar == false) {
        res.json({
          ok: false,
          messege: "No se encontro el registro en la bd",
        });
      } else {
        res.json({
          ok: true,
          message: "Registro actualizado exitosamente",
          data: actualizar,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);
router.patch(
  "/profile/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const actualizar = await service.actualizar_profile(id, body);
      if (actualizar == false) {
        res.json({
          ok: false,
          messege: "No se encontro el registro en la bd",
        });
      } else {
        res.json({
          ok: true,
          message: "Registro actualizado exitosamente",
          data: actualizar,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validatorHandler(delete_schema, "params"),
  async (req, res) => {
    const { id } = req.params;
    const delete_product = await service.delete(id);
    if (delete_product == false) {
      res.json({
        ok: false,
        messege: "No se encontro el registro en la bd",
      });
    } else {
      res.json({
        ok: true,
        messege: "Registro eliminado correctamente",
        id,
      });
    }
  }
);

module.exports = router;
