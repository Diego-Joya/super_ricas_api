const expres = require("express");
const returns_service = require("./services/returns_services");
const zonas_services = require("./services/zones_service");
const productos_services = require("./services/products_services");
// const boom = require("@hapi/boom");
const validatorHandler = require("./../middlewares/validator_handler");
const passport = require("passport");

const router = expres.Router();

const returns = new returns_service();
const zonas = new zonas_services();
const produc = new productos_services();

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
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const consulta_total = await returns.buscar_todos();
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
  "/filters",
  // passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const body = req.body;
      const cat = await returns.buscar_uno(body);
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
  "/apply_return",
  // passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const body = req.body;
      const bander='returns'
      let dataFact = await returns.ConsultaInvetario(body.id_factura,bander);
      let newTotalVenta =
        parseInt(dataFact[0].total_venta) - parseInt(body.valor_total);
      let newSubIva = parseInt(dataFact[0].total_iva) - parseInt(body.total_iva);
      let newComision = parseInt(dataFact[0].total_comision) - parseInt(body.valor_comision);
      body.newTotalVenta = newTotalVenta;
      body.newSubIva = newSubIva;
      body.newComision = newComision;
      let actualizar = await returns.apply_return_fact(body);

      for (let i = 0; i < body.devolutions.length; i++) {
        let dta = [];
        dta.id_factura = body.id_factura;
        dta.id = body.devolutions[i].id;
        let actDevFactura = await returns.actDevFactura(dta);
      }
      res.json({
        ok: true,
        message: 'Devolución aplicada correctamente',
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
      const zona = await zonas.buscar_id(body.id_zona);
      const productos = await produc.buscar_id(body.id_producto);

      body.zona_text = zona[0].nombre;
      body.producto_text = productos[0].nombre;
      const data = body;
      const crear = await returns.crear(data);

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
      const body = req.body;
      const zona = await zonas.buscar_id(body.id_zona);
      const productos = await produc.buscar_id(body.id_producto);

      body.zona_text = zona[0].nombre;
      body.producto_text = productos[0].nombre;
      const actualizar = await returns.actualizar(id, body);
      if (actualizar == false) {
        res.json({
          ok: false,
          message: "El registro no existe en la bd",
        });
      } else {
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
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const delete_returns = await returns.delete(id);
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
