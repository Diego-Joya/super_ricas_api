const expres = require("express");
const zones_service = require("./services/zones_service");
// const boom = require("@hapi/boom");
const {
  create_schema,
  update_schema,
  get_schema,
  delete_schema,
} = require("../schema/zones_schame");
const validatorHandler = require("./../middlewares/validator_handler");
const passport = require('passport');


const router = expres.Router();

const zones = new zones_service();

router.get("/",
passport.authenticate('jwt', { session: false}),
 async (req, res, next) => {
  try {
    const consulta_total = await zones.buscar_todos();
    res.json({
      ok: true,
      data: consulta_total,
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:nombre",
passport.authenticate('jwt', { session: false}),
validatorHandler(get_schema, "params"),
  async (req, res, next) => {
    try {
      const { nombre } = req.params;
      const consulta_id = await zones.buscar_uno(nombre);
        res.json({
          ok: true,
          data: consulta_id,
        });
     
    } catch (error) {
      next(error);
    }
  }
);

router.get("/concat/zones", 
passport.authenticate('jwt', { session: false}),
async (req, res, next) => {
  try {
    const zon = await zones.concatenar_zones();
    res.json({
      ok: true,
      data: zon,
    });
  } catch (error) {
    next(error);
  }
});


router.get(
  "/:nombre",
passport.authenticate('jwt', { session: false}),
validatorHandler(get_schema, "params"),
  async (req, res, next) => {
    try {
      const { nombre } = req.params;
      const consulta_id = await zones.buscar_uno(nombre);
        res.json({
          ok: true,
          data: consulta_id,
        });
     
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/id/:nombre",
passport.authenticate('jwt', { session: false}),
validatorHandler(get_schema, "params"),
  async (req, res, next) => {
    try {
      const { nombre } = req.params;
      const consulta_id = await zones.buscar_id(nombre);
        res.json({
          ok: true,
          data: consulta_id,
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
      const crear = await zones.crear(body);

      res.json({
        ok: true,
        message: "Registro creado exitosamente",
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
      const actualizar = await zones.actualizar(id, body);
      if (actualizar == false) {
        res.json({
          ok: false,
          message: "No se encuentra el registro en la bd",
        });
      } else {
        res.json({
          ok: true,
          message: "Registro actualizado exitosamente",
          data: actualizar,
          id,
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
validatorHandler(delete_schema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const delete_zones = await zones.delete(id);
      if(delete_zones==false){
        res.json({
          ok:false,
          message: "No se encontro el registro en la bd",
          id,
        });
      }else{
        res.json({
          ok:true,
          message: "Registro eliminado correctamente",
          id,
        });
      }
     
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
