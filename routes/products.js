const expres = require("express");
// const { check } = require("express-validator");
// const { validateRoutes } = require("../utils/validateRoutes");
// const { validateUsers } = require("../controllers/auth");
const productService = require("./services/products_services");
// const boom = require("@hapi/boom");
const {
  create_product_schema,
  update_product_schema,
  get_product_schema,
  delete_product_schema,
} = require("../schema/product_schame");
const validatorHandler = require("./../middlewares/validator_handler");
const passport = require('passport');


const router = expres.Router();

const service = new productService();

router.get("/", 
passport.authenticate('jwt', { session: false}),
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
});

router.get("/concat/produc", 
passport.authenticate('jwt', { session: false}),
async (req, res, next) => {
  try {
    const productos = await service.concatenar_prod();
    res.json({
      ok: true,
      data: productos,
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:nombre",
  passport.authenticate('jwt', { session: false}),
  validatorHandler(get_product_schema, "params"),
  // router.get("/:id",
  async (req, res, next) => {
    try {
      const { nombre } = req.params;
      const producto = await service.buscar_uno(nombre);
      res.json({
        ok: true,
        data: producto,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/id/:nombre",
  passport.authenticate('jwt', { session: false}),
  validatorHandler(get_product_schema, "params"),
  // router.get("/:id",
  async (req, res, next) => {
    try {
      const { nombre } = req.params;
      const producto = await service.buscar_id(nombre);
      res.json({
        ok: true,
        data: producto,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  passport.authenticate('jwt', { session: false}),
  validatorHandler(create_product_schema, "body"),
  async (req, res) => {
    const body = req.body;
    const crear = await service.crear(body);

    res.json({
      ok: true,
      message: "Registro creado correctamente!",
      data: crear,
    });
  }
);

router.patch(
  "/:id",
  passport.authenticate('jwt', { session: false}),
  validatorHandler(update_product_schema, "body"),
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

router.delete(
  "/:id",
  passport.authenticate('jwt', { session: false}),
  validatorHandler(delete_product_schema, "params"),
  async (req, res) => {
    const { id } = req.params;
    const delete_product = await service.delete_product(id);
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
