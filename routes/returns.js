const expres = require("express");
const returns_service = require("./services/returns_services");
// const boom = require("@hapi/boom");
const validatorHandler = require("./../middlewares/validator_handler");
const passport = require("passport");

const router = expres.Router();

const returns = new returns_service();

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
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const body = req.body;
     
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
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
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
