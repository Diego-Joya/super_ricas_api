const expres = require("express");
const inv_zones_services = require("./services/inv_zones_services");
// const boom = require("@hapi/boom");
const {
  create_schema,
  update_schema,
  get_schema,
  delete_schema,
} = require("../schema/inv_zones_schame");
const validatorHandler = require("./../middlewares/validator_handler");
const passport = require('passport');


const router = expres.Router();

const inv_zonas = new inv_zones_services();

router.get("/",
passport.authenticate('jwt', { session: false}),
 async (req, res, next) => {
  try {
    const consulta_total = await inv_zonas.buscar_todos();
    res.json({
      ok: true,
      data: consulta_total,
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id/:fecha_ini/:fecha_fin",
passport.authenticate('jwt', { session: false}),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { fecha_ini } = req.params;
      const { fecha_fin } = req.params;
      const consulta_id = await inv_zonas.buscar_uno(id,fecha_ini,fecha_fin);
        res.json({
          ok: true,
          data: consulta_id
        });
  
    } catch (error) {
      next(error);
    }
  }
);

router.post("/",
passport.authenticate('jwt', { session: false}),
 validatorHandler(create_schema, "body"), async (req, res, next) => {
 try {
  const body = req.body;
  const crear = await inv_zonas.crear(body);

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

router.post("/filters/",
// passport.authenticate('jwt', { session: false}),
//  validatorHandler(create_schema, "body"),
  async (req, res, next) => {
 try {
  const body = req.body;
  const crear = await inv_zonas.filters(body);

  res.json({
    ok: true,
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
      const actualizar = await inv_zonas.actualizar(id, body);
      if(actualizar== false){
        res.json({
          ok: false,
          message: "El registro no existe en la bd",
        });
      }else{
        res.json({
          message: "Registro actualizado correctamente",
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
    const delete_zones = await inv_zonas.delete(id);
    if(delete_zones == false){
      res.json({
        ok: false,
        message: "El registro no existe en la bd",
        id,
      });
    }else{
      res.json({
        ok: true,
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
