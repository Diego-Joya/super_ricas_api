const expres = require("express");
// const { check } = require("express-validator");
const category_service = require("./services/category_services");
const boom = require("@hapi/boom");
const passport = require('passport');

const {
  create_schema,
  update_schema,
  get_schema,
  delete_schema,
} = require("../schema/category_schame");
const validatorHandler = require("./../middlewares/validator_handler");
const router = expres.Router();
const categoria = new category_service();

router.get("/", async (req, res, next) => {
  try {
    const cat = await categoria.buscar_todos();
    res.json({
      ok:true,
      data: cat,
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:nombre",
  validatorHandler(get_schema, "params"),
  passport.authenticate('jwt', { session: false}),

  async (req, res, next) => {
    try {
      const { nombre } = req.params;
      const cat = await categoria.buscar_uno(nombre);
        res.json({
          ok: true,
          data: cat,
        });
      
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  passport.authenticate('jwt', { session: false}),

  validatorHandler(create_schema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body;
      const crear = await categoria.crear(body);

      res.json({
        ok: true,
        message: "Registro creado exitosamente!",
        data: crear,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/:id",
  passport.authenticate('jwt', { session: false}),

  validatorHandler(update_schema, "body"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const actualizar = await categoria.actualizar(id, body);
      if (actualizar == false) {
        res.json({
          ok: false,
          messege: "No se encontro el registro en la bd",
        });
      } else {
        res.json({
          ok: true,
          message: "Registro actualizado correctamente",
          data: body,
          id,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:id",
passport.authenticate('jwt', { session: false}),
async (req, res, next) => {
  try {
    const { id } = req.params;
    const delete_cate = await categoria.delete(id);
    if (delete_cate == false) {
      res.json({
        ok: false,
        message: "No se encontro el registro en la bd",
      });
    } else {
      res.json({
        ok: true,
        message: "Registro eliminado correctamente!",
        id,
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
