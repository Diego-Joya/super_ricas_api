const expres = require("express");
const balances = require("./services/balances_services");
const zonas_services = require("./services/zones_service");

// const boom = require("@hapi/boom");
const validatorHandler = require("./../middlewares/validator_handler");
const passport = require("passport");

const router = expres.Router();

const balance = new balances();
const zonas = new zonas_services();

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const consulta_total = await returns.buscar_uno(id);
      res.json({
        ok: true,
        data: consulta_total,
      });
    } catch (error) {
      next(error);
    }
  }
);
router.get(
  "/",
  // passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const consulta_total = await balance.buscar_todos();
      res.json({
        ok: true,
        data: consulta_total,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  // passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const body = req.body;
      const dat = {};
      const zona = await zonas.buscar_id(body.zona);
      console.log(zona);
      dat.cod_factura = body.cod_factura;
      dat.zona = body.zona;
      dat.zona_text = zona[0].nombre;
      dat.usuario = body.usuario;
      const crear = await balance.crear(dat);

      for (let i = 0; i < body.productos.length; i++) {
        body.productos[i].id_encabezado = crear[0].id;
        body.productos[i].usuario = body.usuario;
        const crear_det = await balance.crear_saldos_det(body.productos[i]);
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
  // passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body
      const zona = await zonas.buscar_id(body.zona);
      console.log(zona);
      let dat={};
      dat.cod_factura = body.cod_factura;
      dat.zona = body.zona;
      dat.zona_text = zona[0].nombre;
      dat.usuario = body.usuario;

      const actualizar = await balance.actualizar(id, dat);
      if (actualizar == false) {
        res.json({
          ok: false,
          message: "El registro no existe en la bd",
        });
      }

      const existentes = await balance.consult_saldos_det(id);
      console.log(existentes);
      let detalles = [];

      for (let i = 0; i < existentes.length; i++) {
        detalles.push(existentes[i].id);
      }
      console.log(detalles);
      let contador = 0;


      for (let i = 0; i < body.productos.length; i++) {
        body.productos[i].usuario = body.usuario;
        body.productos[i].id_encabezado = id;
        if (typeof body.productos[i].id != "undefined") {
          if (detalles.includes(body.productos[i].id)) {
            contador++;
            console.log('actualizando');

            const actualizar_det = await balance.actualizar_saldos_det(
              body.productos[i].id,
              body.productos[i]
            );
          }
        } else {
          console.log('estoy creando');
          const crear_det = await balance.crear_saldos_det(body.productos[i]);
          console.log(crear_det);
        }
      }
      res.json({
        ok: true,
        message: "Registro actualizado correctamente"
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const delete_returns = await balance.delete(id);
      if (delete_returns == false) {
        res.json({
          ok: false,
          message: "El registro no existe en la bd",
          id,
        });
      } else {
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
