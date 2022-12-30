const expres = require("express");
// const { check } = require("express-validator");
const Invetario_detalle = require("./services/invetario_det_services");
// const boom = require("@hapi/boom");
const passport = require("passport");

const {
  create_schema,
  update_schema,
  get_schema,
  delete_schema,
} = require("../schema/category_schame");
const validatorHandler = require("./../middlewares/validator_handler");
const router = expres.Router();
const invetario = new Invetario_detalle();

// CONSULTA MERCANCIA ZONAS
router.post(
  "/inven_zonas",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const body = req.body;
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

// CONSULTA MERCANCIA ZONAS DESTALLES

// router.get("/inven_zonas_det", async (req, res, next) => {
//   try {
//     const cat = await invetario.consult_invetario_zonas();
//     res.json({
//       ok: true,
//       data: cat,
//     });
//   } catch (error) {
//     next(error);
//   }
// });
// CONSULTA MERCANCIA ZONAS DESTALLES
router.get(
  "/inven_zonas_det/:nombre",
  validatorHandler(get_schema, "params"),
  passport.authenticate("jwt", { session: false }),

  async (req, res, next) => {
    try {
      const { nombre } = req.params;
      const cat = await invetario.consult_invetario_zonas_det(nombre);
      res.json({
        ok: true,
        data: cat,
      });
    } catch (error) {
      next(error);
    }
  }
);
// CONSULTA MERCACIA POR ID
router.get(
  "/inven_zonas/id/:nombre",
  validatorHandler(get_schema, "params"),
  passport.authenticate("jwt", { session: false }),

  async (req, res, next) => {
    try {
      const { nombre } = req.params;
      const cat = await invetario.consult_invetario_zonas_id(nombre);
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
  passport.authenticate("jwt", { session: false }),

  //   validatorHandler(create_schema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body;
      console.log(body);
      const dta = {};
      dta.fecha_dia = body.fecha_dia;
      dta.id_zona = body.id_zona;
      dta.usuario = body.usuario;
      dta.saldo_base = body.saldo_base;
      dta.zona_text = body.zona_text;

      const crear = await invetario.crear_inv_zona(dta);
      const consulta = await invetario.consult_invetario_zonas_id(crear[0].id);
      crear[0].zona_text = consulta[0].zona_text;

      const registro = [];
      const detalle = [];
      registro.push(crear[0]);
      console.log(registro);
      for (let i = 0; i < body.detalles.length; i++) {
        body.detalles[i].id_invetario = crear[0].id;
        body.detalles[i].id_zona = body.id_zona;
        body.detalles[i].usuario = body.usuario;
        const crear_det = await invetario.crear_inv_det(body.detalles[i]);
        detalle.push(crear_det[0]);
      }
      registro.push(detalle);

      res.json({
        ok: true,
        message: "Registros creados exitosamente!",
        data: crear,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "estado/:id",
  passport.authenticate("jwt", { session: false }),

  // validatorHandler(update_schema, "body"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      console.log(id);
      const body = req.body;
      const consulta = await invetario.consult_invetario_zonas_id(id);
      if (consulta == "") {
        res.json({
          ok: false,
          messege: "No se encontro el registro en la bd",
        });
      }
      const actualizar_estado = await invetario.actualizar_estado_inventario(
        id
      );

      res.json({
        ok: true,
        message: "Registro actualizado correctamente",
        data: resp,
        id,
      });
    } catch (error) {
      next(error);
    }
  }
);
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),

  // validatorHandler(update_schema, "body"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const consulta = await invetario.consult_invetario_zonas_id(id);
      if (consulta == "") {
        res.json({
          ok: false,
          messege: "No se encontro el registro en la bd",
        });
      }
      const dta = {};
      dta.fecha_dia = body.fecha_dia;
      dta.id_zona = body.id_zona;
      dta.usuario = body.usuario;
      dta.saldo_base = body.saldo_base;

      const actualizar = await invetario.actualizar(id, dta);

      const existentes = await invetario.consult_invetario_zonas_det(id);
      console.log(existentes);
      let detalles = [];

      for (let i = 0; i < existentes.length; i++) {
        detalles.push(existentes[i].id);
      }
      console.log(detalles);
      let contador = 0;

      for (let i = 0; i < body.detalles.length; i++) {
        console.log(body.detalles[i].id);
        body.detalles[i].usuario = body.usuario;
        body.detalles[i].id_zona = body.id_zona;
        body.detalles[i].id_invetario = id;
        if (typeof body.detalles[i].id != "undefined") {
          if (detalles.includes(body.detalles[i].id)) {
            contador++;

            const actualizar_det = await invetario.actualizar_det(
              body.detalles[i].id,
              body.detalles[i]
            );
          }
        } else {
          const crear_det = await invetario.crear_inv_det(body.detalles[i]);
          console.log(crear_det);
        }
      }

      const res_cantidades = await invetario.consult_invetario_cantidades(id);
      if (res_cantidades[0].cantidad == res_cantidades[0].cantidad_salidad) {
        const actualizar_estado = await invetario.actualizar_estado_inventario(
          id
        );
      }
      const resp = await invetario.consult_invetario_zonas_id(id);

      res.json({
        ok: true,
        message: "Registro actualizado correctamente",
        data: resp,
        id,
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
      const consulta = await invetario.consult_invetario_zonas_id(id);
      if (consulta == "") {
        res.json({
          ok: false,
          messege: "No se encontro el registro en la bd",
        });
      }

      const existentes = await invetario.consult_invetario_zonas_det(id);
      for (let i = 0; i < existentes.length; i++) {
        const delete_det = await invetario.delete_invetario_zonas_det(
          existentes[i].id
        );
      }
      const delete_zonas = await invetario.delete_invetario_zonas(id);

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
router.delete(
  "/inven_zonas_det/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const consulta = await invetario.consult_invetario_zonas_det_id(id);
      if (consulta == "") {
        res.json({
          ok: false,
          messege: "No se encontro el registro en la bd",
        });
      }

      const delete_det = await invetario.delete_invetario_zonas_det(id);

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

module.exports = router;
