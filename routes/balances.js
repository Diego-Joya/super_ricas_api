const expres = require("express");
const balances = require("./services/balances_services");
const zonas_services = require("./services/zones_service");
const returns_service = require("./services/returns_services");

// const boom = require("@hapi/boom");
const validatorHandler = require("./../middlewares/validator_handler");
const passport = require("passport");

const router = expres.Router();

const balance = new balances();
const zonas = new zonas_services();
const returns = new returns_service();
router.get(
  "/",
  // passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
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

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const consulta_total = await balance.validar(id);
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
  "/cons_invetario/:id",
  // passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const consulta_total = await balance.consult_invetario_cod(id);
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
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const body = req.body;
      const dat = {};
      const zona = await zonas.buscar_id(body.zona);
      dat.cod_factura = body.cod_factura;
      dat.zona = body.zona;
      dat.zona_text = zona[0].nombre;
      dat.usuario = body.usuario;
      dat.valor_venta = body.valor_venta;
      dat.valor_iva = body.valor_iva;
      dat.valor_comision = body.valor_comision;
      const crear = await balance.crear(dat);

      for (let i = 0; i < body.productos.length; i++) {
        body.productos[i].id_encabezado = crear[0].id;
        body.productos[i].usuario = body.usuario;
        const crear_det = await balance.crear_saldos_det(body.productos[i]);
      }
      const bander = "balances";
      let dataFact = await returns.ConsultaInvetario(body.cod_factura, bander);
      let newTotalVenta =
        parseInt(dataFact[0].total_venta) - parseInt(body.valor_venta);
      let newSubIva =
        parseInt(dataFact[0].total_iva) - parseInt(body.valor_iva);
      let newComision =
        parseInt(dataFact[0].total_comision) - parseInt(body.valor_comision);
      body.newTotalVenta = newTotalVenta;
      body.newSubIva = newSubIva;
      body.newComision = newComision;
      body.id_saldo = crear[0].id;
      let act_factura = await balance.apply_saldo_fac(body);
      res.json({
        ok: true,
        message: "Registros guardados exitosamente",
        data: crear[0],
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
      const body = req.body;
      const Consult_saldo = await balance.validar(id);
      const valor_total =
        parseInt(Consult_saldo[0].valor_venta) - parseInt(body.valor_venta);
      const valor_iva =
        parseInt(Consult_saldo[0].valor_iva) - parseInt(body.valor_iva);
      const valor_comision =
        parseInt(Consult_saldo[0].valor_comision) -
        parseInt(body.valor_comision);

      const bander = "balances";
      let dataFact = await returns.ConsultaInvetario(body.cod_factura, bander);

      if (valor_total < 0) {
        body.newTotalVenta =
          parseInt(dataFact[0].total_venta) - parseInt(valor_total);
      } else {
        body.newTotalVenta =
          parseInt(dataFact[0].total_venta) + parseInt(valor_total);
      }
      if (valor_iva < 0) {
        body.newSubIva = parseInt(dataFact[0].total_iva) - parseInt(valor_iva);
      } else {
        body.newSubIva = parseInt(dataFact[0].total_iva) + parseInt(valor_iva);
      }
      if (valor_comision < 0) {
        body.newComision =
          parseInt(dataFact[0].total_comision) - parseInt(valor_comision);
      } else {
        body.newComision =
          parseInt(dataFact[0].total_comision) + parseInt(valor_comision);
      }
      let act_factura = await balance.apply_saldo_fac(body);

      const zona = await zonas.buscar_id(body.zona);
      let dat = {};
      dat.cod_factura = body.cod_factura;
      dat.zona = body.zona;
      dat.zona_text = zona[0].nombre;
      dat.usuario = body.usuario;
      dat.valor_venta = body.valor_venta;
      dat.valor_iva = body.valor_iva;
      dat.valor_comision = body.valor_comision;

      const actualizar = await balance.actualizar(id, dat);
      if (actualizar == false) {
        res.json({
          ok: false,
          message: "El registro no existe en la bd",
        });
      }

      const existentes = await balance.consult_saldos_det(id);
      let detalles = [];

      for (let i = 0; i < existentes.length; i++) {
        detalles.push(existentes[i].id);
      }
      let contador = 0;

      for (let i = 0; i < body.productos.length; i++) {
        body.productos[i].usuario = body.usuario;
        body.productos[i].id_encabezado = id;
        if (typeof body.productos[i].id != "undefined") {
          if (detalles.includes(body.productos[i].id)) {
            contador++;

            const actualizar_det = await balance.actualizar_saldos_det(
              body.productos[i].id,
              body.productos[i]
            );
          }
        } else {
          const crear_det = await balance.crear_saldos_det(body.productos[i]);
        }
      }

      res.json({
        ok: true,
        message: "Registro actualizado correctamente",
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/saldos_det/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const delete_saldos_det = await balance.delete_saldos_det_uno(id);
      if (delete_saldos_det == false) {
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

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const consulta = await balance.validar(id);
      if (consulta == "") {
        res.json({
          ok: false,
          messege: "No se encontro el registro en la bd",
        });
      }

      const delete_saldos = await balance.delete_saldos(id);
      const delete_saldos_det = await balance.delete_saldos_det(id);

      res.json({
        ok: true,
        message: "Registro eliminado correctamente!",
        id,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/filters",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const body = req.body;
      const cat = await balance.buscar_uno(body);
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
