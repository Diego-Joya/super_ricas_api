const expres = require("express");
const validatorHandler = require("./../middlewares/validator_handler");
const passport = require("passport");
const Invetario_detalle = require("./services/invetario_det_services");
const returns_service = require("./services/returns_services");
const payments_service = require("./services/payments_services");

const router = expres.Router();
const invetario = new Invetario_detalle();
const returns = new returns_service();
const payments = new payments_service();

router.post(
  "/",
  // passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    const body = req.body;
    try {
      const body = req.body;
      console.log(body);
      const dta = {};
      dta.fecha_dia = body.fecha_dia;
      dta.id_zona = body.id_zona;
      dta.usuario = body.usuario;
      dta.saldo_base = body.saldo_base;
      dta.zona_text = body.zona_text;
      dta.codigo = body.codigo;
      dta.total_comision = body.total_comision;
      dta.total_iva = body.total_iva;
      dta.total_venta = body.total_venta;

      const bandera = "balances";
      let dataFact = await returns.ConsultaInvetario(body.codigo, bandera);
      console.log(dataFact);
      if (dataFact.length > 0) {
        res.json({
          ok: false,
          messege:
            "El codigo de factura ya existe en la bd... ¡Verifique e intente de nuevo!",
        });
      }
      let id;

      if (body.id !== undefined) {
        id = body.id;
        const actualizar = await invetario.actualizar(body.id, dta);
      } else {
        const crear = await invetario.crear_inv_zona(dta);
        id = crear[0].id;
      }
      console.log("id inventario es", id);

      if (body.productos != undefined) {
        for (let i = 0; i < body.productos.length; i++) {
          body.productos[i].usuario = body.usuario;
          body.productos[i].id_zona = body.id_zona;
          body.productos[i].id_invetario = id;
          console.log(body.productos[i]);
          if (body.productos[i].id !== undefined) {
            let actualizar_det = await invetario.actualizar_det(
              body.productos[i].id,
              body.productos[i]
            );
          } else {
            const crear_det = await invetario.crear_inv_det(body.productos[i]);
          }
        }
      } else if (body.devoluciones != undefined) {
        for (let i = 0; i < body.devoluciones.length; i++) {
          body.devoluciones[i].usuario = body.usuario;
          body.devoluciones[i].id_zona = body.id_zona;
          body.devoluciones[i].zona_text = body.zona_text;
          console.log(body.devoluciones[i]);
          if (body.devoluciones[i].id !== undefined) {
            const actualizar = await returns.actualizar(
              body.devoluciones[i].id,
              body.devoluciones[i]
            );
          } else {
            const crear = await returns.crear(body.devoluciones[i]);
          }
        }
      } else if (body.pays != undefined) {
        for (let i = 0; i < body.pays.length; i++) {
          if (typeof body.pays[i].id === "undefined") {
            let data = body.pays[i];
            const crear = await payments.crear(data);
          } else {
            let id = body.pays[i].id;
            let data = body.pays[i];
            const actualizar = await payments.actualizar(id, data);
          }
        }
      }

      res.json({
        ok: true,
        message: "Datos guardados correctamente!",
        data: "data",
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
