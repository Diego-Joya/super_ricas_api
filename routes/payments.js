const expres = require("express");
const payments_service = require("./services/payments_services");
// const boom = require("@hapi/boom");
const validatorHandler = require("./../middlewares/validator_handler");
const passport = require('passport');


const router = expres.Router();

const payments = new payments_service();

router.get("/",
passport.authenticate('jwt', { session: false}),
 async (req, res, next) => {
  try {
    const consulta_total = await payments.buscar_todos();
    res.json({
      ok: true,
      data: consulta_total,
    });
  } catch (error) {
    next(error);
  }
});



router.post("/",
passport.authenticate('jwt', { session: false}),
 async (req, res, next) => {
 try {
  const body = req.body;
  console.log('ESTE ES EL BODY MIRELOOOOOOOO');
  console.log(body.pays);
for (let i = 0; i < body.pays.length; i++) {
    console.log('holaaa putito que  miras...!');

    if(typeof body.pays[i].id ==='undefined'){
        let data = body.pays[i]
        const crear = await payments.crear(data);

    }else{
        let id = body.pays[i].id;
        let data = body.pays[i]
        const actualizar = await payments.actualizar(id, data);
    }
    
}

  res.json({
    ok: true,
    message: "Registros guardados exitosamente",
  });
 } catch (error) {
  next(error);
 }
}
);


router.patch(
  "/:id",
passport.authenticate('jwt', { session: false}),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const actualizar = await payments.actualizar(id, body);
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
  async (req, res, next) => {
  try {
    const { id } = req.params;
    const delete_zones = await payments.delete(id);
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
