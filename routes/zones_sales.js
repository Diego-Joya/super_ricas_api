const expres = require("express");
const venta_zonas = require("./services/sales_services");
const Invetario_detalle = require("./services/invetario_det_services");

const passport = require("passport");
const invetario = new Invetario_detalle();


const router = expres.Router();
router.post(
    "/vent_zonas",
    // passport.authenticate("jwt", { session: false }),
    async (req, res, next) => {
      try {
        const body = req.body;
        console.log(body);
        const cat = await invetario.consult_invetario_zonas(body);
        res.json({
          ok: true,
          data: cat,
        });
      } catch (error) {
        next(error);
      }
    }
  );

module.exports = router;
