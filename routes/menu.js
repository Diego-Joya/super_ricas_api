const expres = require("express");
const validatorHandler = require("./../middlewares/validator_handler");
const passport = require("passport");
const Invetario_detalle = require("./services/invetario_det_services");
const returns_service = require("./services/returns_services");
const payments_service = require("./services/payments_services");
const balances = require("./services/balances_services");

const router = expres.Router();
const invetario = new Invetario_detalle();
const returns = new returns_service();
const payments = new payments_service();
const balance = new balances();
router.post(
  "/",
  // passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    const body = req.body;
    try {
      const body = req.body;
      const dta = {};
      dta.fecha_dia = body.fecha_dia;
      dta.id_zona = body.id_zona;
      dta.usuario = body.usuario;
      dta.saldo_base = body.saldo_base;
      dta.zona_text = body.zona_text;
      dta.codigo = body.codigo;
      dta.total_comision = body.valor_comision;
      dta.total_iva = body.valor_iva;
      dta.total_venta = body.valor_venta;

      let id;

      if (body.id !== undefined && body.id != "") {
        id = body.id;
        const actualizar = await invetario.actualizar(body.id, dta);
      } else {
        const bandera = "balances";
        let dataFact = await returns.ConsultaInvetario(body.codigo, bandera);
        if (dataFact.length > 0 && body.saldos == undefined) {
          res.json({
            ok: false,
            message:
              "El codigo de factura ya existe en la bd... ¡Verifique e intente de nuevo!",
          });
          return;
        }

        const crear = await invetario.crear_inv_zona(dta);
        id = crear[0].id;
      }
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
        res.json({
          ok: true,
          message: "Datos guardados correctamente!",
          data: id,
        });
        return;
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
        res.json({
          ok: true,
          message: "Datos guardados correctamente!",
          data: id,
        });
        return;
      } else if (body.ingresos != undefined) {
        for (let i = 0; i < body.ingresos.length; i++) {
          console.log(body.ingresos[i].id);
          if (body.ingresos[i].id != undefined && body.ingresos[i].id != "") {
            let id = body.ingresos[i].id;
            let data = body.ingresos[i];
            const actualizar = await payments.actualizar(id, data);
          } else {
            let data = body.ingresos[i];
            const crear = await payments.crear(data);
          }
        }
        res.json({
          ok: true,
          message: "Datos guardados correctamente!",
          data: id,
        });
        return;
      } else if (body.saldos != undefined) {
        const Consult_saldo = await balance.validar_factura(body.codigo);
        console.log("consultas saldos anteriores");
        console.log(Consult_saldo);
        console.log(Consult_saldo.length == 0);
if(Consult_saldo.length == 0){
  const id_secun_saldo= await balance.secuencia_id_saldos();
  console.log('seciencia id saldos');
  console.log(id_secun_saldo[0][nextval]);
  return;
}
        
        let valor_iva = 0;
        let valor_venta = 0;
        let valor_comision = 0;
        let id_saldo = 0;

        // if (Consult_saldo.length == 0) {
        //   let valor = [];
        //   valor.cod_factura = body.codigo;
        //   valor.zona = body.zona;
        //   valor.zona_text = body.zona_text;
        //   valor.usuario = body.usuario;
        //   valor.valor_venta = valor_venta;
        //   valor.valor_iva = valor_iva;
        //   valor.valor_comision = valor_comision;
        //   const crear_saldo = await balance.crear(valor);
        //   id_saldo = crear_saldo[0].id;
        // } else {
        //   id_saldo = Consult_saldo[0].id;
        //   const actualizar = await balance.actualizar(id, body);
        // }
       
        console.log("saldos...");
        console.log(body.saldos);
        for (let i = 0; i < body.saldos.length; i++) {
          valor_iva += parseInt(body.saldos[i].valor_iva);
          valor_venta += parseInt(body.saldos[i].valor_venta);
          valor_comision += parseInt(body.saldos[i].valor_comision);
          body.saldos[i].usuario = body.usuario;
          body.saldos[i].id_zona = body.id_zona;
          body.saldos[i].id_encabezado = id;

          if (body.saldos[i].id == undefined) {
            console.log("crea");
            const crear_det = await balance.crear_saldos_det(body.saldos[i]);
          } else {
            console.log("actualiza");
            let id = body.saldos[i].id;
            let data = body.saldos[i];
            const actualizar = await balance.actualizar_saldos_det(id, data);
          }
        }
        if (Consult_saldo.length == 0) {
          let valor = [];
          valor.cod_factura = body.codigo;
          valor.zona = body.zona;
          valor.zona_text = body.zona_text;
          valor.usuario = body.usuario;
          valor.valor_venta = valor_venta;
          valor.valor_iva = valor_iva;
          valor.valor_comision = valor_comision;
          const crear_saldo = await balance.crear(valor);
          id_saldo = crear_saldo[0].id;
          let newTotalVenta =
            parseInt(body.valor_venta) - parseInt(valor_venta);
          let newSubIva = parseInt(body.valor_iva) - parseInt(valor_iva);
          let newComision =
            parseInt(body.valor_comision) - parseInt(valor_comision);
          body.newTotalVenta = newTotalVenta;
          body.newSubIva = newSubIva;
          body.newComision = newComision;
          body.id_saldo = crear_saldo[0].id;
          let act_factura = await balance.apply_saldo_fac(body);
        } else {
          id_saldo = Consult_saldo[0].id;
          const new_valor_venta =
            parseInt(body.valor_venta) - parseInt(valor_venta);
          const new_valor_iva = parseInt(body.valor_iva) - parseInt(valor_iva);
          const new_valor_comision =
            parseInt(body.valor_comision) - parseInt(valor_comision);

          const actualizar = await balance.actualizar(id, body);
          let act_factura = await balance.apply_saldo_fac(body);
        }


        // console.log(valor_comision);
        // console.log(valor_iva);
        // console.log(valor_venta);

        // const crear = await balance.crear(dat);
        res.json({
          ok: false,
          message: "Datos guardados correctamente!",
          data: id,
        });
        return;
      }

      res.json({
        ok: true,
        message: "Se produjo un error al guardar!",
        data: id,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
