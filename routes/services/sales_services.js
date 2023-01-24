const pool = require("./../../db/connection");
const moment = require("moment");

class sales_services {
  constructor() {
    this.pool = pool;
    this.pool.on("error", (err) => console.error(err));
  }

  async consult_vent_zonas(body) {
    // const data = body.data;
    const fecha_ini = body.fecha_inicio;
    const fecha_fin = body.fecha_fin;
    console.log(fecha_ini);
    let where = ` where 1=1`;
    if (typeof fecha_ini !== "undefined" && fecha_ini != "") {
      where += ` and a.fecha_dia between '${fecha_ini}' and '${fecha_fin}'`;
    }
    console.log(where);
    const query = `select a.*,((select sum(valor_venta::double precision)  from inventario_zonas_det where  id_inventario=a.id) + a.saldo_base
    )as valor_venta,((select sum(precio_total::double precision)  from inventario_zonas_det where  id_inventario=a.id
      )+ a.saldo_base) as precio_total, (select sum(valor_comision::double precision)  from inventario_zonas_det where  id_inventario=a.id
      )as valor_comision,(select sum(valor_iva::double precision)  from inventario_zonas_det where  id_inventario=a.id
      )as valor_iva,(select sum(valor::double precision)  from pago where  id_iventario=a.id
      )as valor_ingresos,((select sum(valor_venta::double precision)  from inventario_zonas_det where  id_inventario=a.id) - (select sum(valor::double precision)  from pago where  id_iventario=a.id
      ))as valor_pendiente,a.fecha_dia::text as fecha_dia, a.id as key, b.nombre as zona_text
       from inventario_zonas a LEFT join zonas b on (a.id_zona=b.id) ${where} order by id desc`;

    const rta = await this.pool.query(query);
    console.log(rta.rows.length);
    return rta.rows;
  }
}
module.exports = sales_services;
