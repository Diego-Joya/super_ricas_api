// const boom = require("@hapi/boom");
const pool = require("./../../db/connection");
const moment = require("moment");

class returns_service {
  constructor() {
    this.pool = pool;
    this.pool.on("error", (err) => console.error(err));
  }

  async crear(body) {
    const usuario = body.usuario;
    const id_zona = body.id_zona;
    const zona_text = body.zona_text;
    const id_producto = body.id_producto;
    const producto_text = body.producto_text;
    const cantidad = body.cantidad;
    const fecha = body.fecha;
    const tipo = body.tipo_devolucion;
    const fecha_hora = moment().format("YYYY-MM-DD HH:mm:ss");
    const estado = "PENDIENTE";

    const query = `INSERT INTO public.devolucion(usuario, fecha_creacion, id_zona, zona_text, id_producto, producto_text, cantidad, fecha,estado, tipo_devolucion)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    const rta = await this.pool
      .query(query, [
        usuario,
        fecha_hora,
        id_zona,
        zona_text,
        id_producto,
        producto_text,
        cantidad,
        fecha,
        estado,
        tipo,
      ])
      .catch((err) => console.log(err));
    return rta.rows;
  }

  async buscar_todos() {
    const rta = await this.pool
      .query(`SELECT *,fecha::text as fecha, id as key FROM devolucion`)
      .catch((err) => console.log(err));
    return rta.rows;
  }

  async ConsultaInvetario(data) {
    const rta = await this.pool
      .query(`SELECT *, id as key FROM inventario_zonas where id=${data}`)
      .catch((err) => console.log(err));
    return rta.rows;
  }

  async buscar_uno(body) {
    const data = body.buscar;
    const zona = body.zona;
    const estado = body.estado;
    const fecha_ini = body.fecha_inicio;
    const fecha_fin = body.fecha_fin;
    const tipo_devolucion = body.tipo_devolucion;
    console.log(fecha_ini);
    let where = ` where 1=1`;
    if (typeof data !== "undefined" && data !== "") {
      where += `  and a.zona_text::text ILIKE ('%${data}%') or a.producto_text::text ILIKE ('%${data}%') `;
    }
    if (typeof zona !== "undefined" && zona !== "") {
      where += `  and a.id_zona=${zona}`;
    }
    if (typeof estado !== "undefined" && estado !== "") {
      where += `  and a.estado='${estado}'`;
    }
    if (typeof fecha_ini !== "undefined" && fecha_ini != "") {
      where += ` and a.fecha between '${fecha_ini}' and '${fecha_fin}'`;
    }
    if (typeof tipo_devolucion !== "undefined" && tipo_devolucion != "") {
      where += ` and a.tipo_devolucion ='${tipo_devolucion}'`;
    }

    const query = `select a.*, a.id as key, b.precio, b.iva, b.porcen_comision from devolucion a left join productos b on (a.id_producto = b.id)   ${where} order by id desc`;
    console.log(query);
    const rta = await this.pool.query(query).catch((err) => console.log(err));
    return rta.rows;
  }

  async actualizar(idact, body) {
    const usuario = body.usuario;
    const id_zona = body.id_zona;
    const zona_text = body.zona_text;
    const id_producto = body.id_producto;
    const producto_text = body.producto_text;
    const cantidad = body.cantidad;
    const tipo = body.tipo_devolucion;
    const fecha = body.fecha;

    const fecha_hora = moment().format("YYYY-MM-DD HH:mm:ss");

    let consu = await this.buscar_uno(idact);
    if (consu == "") {
      return false;
    }
    const rta = await this.pool
      .query(
        `UPDATE public.devolucion
    SET  usuario=$1, fecha_modificacion=$2, id_zona=$3, zona_text=$4, id_producto=$5, producto_text=$6, cantidad=$7, fecha=$8, tipo_devolucion=$9
    WHERE id=$10 `,
        [
          usuario,
          fecha_hora,
          id_zona,
          zona_text,
          id_producto,
          producto_text,
          cantidad,
          fecha,
          tipo,
          idact,
        ]
      )
      .catch((err) => console.log(err));
    return rta;
  }

  async delete(id_delete) {
    let consu = await this.buscar_uno(id_delete);
    if (consu == "") {
      return false;
    }
    const rta = await this.pool
      .query(
        `DELETE FROM public.devolucion
    WHERE id=$1`,
        [id_delete]
      )
      .catch((err) => console.log(err));
    return rta;
  }

  async apply_return_fact(body) {
    console.log(body);
    const newComision = body.newComision;
    const newTotalVenta = body.newTotalVenta;
    const newSubIva = body.newSubIva;
    const id_factura = body.id_factura;
    const rta = await this.pool
      .query(
        `UPDATE public.inventario_zonas
    SET  total_comision=$1, total_iva=$2, total_venta=$3
    WHERE id=$4 `,
        [newComision, newSubIva, newTotalVenta, id_factura]
      )
      .catch((err) => console.log(err));
    return rta.rows;
  }
  
  async actDevFactura(body) {
    console.log(body);
    const id_factura = body.id_factura;
    const id = body.id;
    const estado = 'APLICADA';
    const rta = await this.pool
      .query(
        `UPDATE public.devolucion
    SET  id_factura=$1,estado=$2
    WHERE id=$3 `,
        [id_factura,estado, id]
      )
      .catch((err) => console.log(err));
    return rta.rows;
  }
}
module.exports = returns_service;
