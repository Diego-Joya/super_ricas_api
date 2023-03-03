// const boom = require("@hapi/boom");
const pool = require("./../../db/connection");
const moment = require("moment");

class balances_services {
  constructor() {
    this.pool = pool;
    this.pool.on("error", (err) => console.error(err));
  }

  // CREAR SALDOS DET
  async crear_saldos_det(body) {
    console.log(body);
    const usuario = body.usuario;
    const producto = body.id_producto;
    const producto_text = body.producto_text;
    const cantidad = body.cantidad;
    const id_saldo = body.id_encabezado;
    const fecha_hora = moment().format("YYYY-MM-DD HH:mm:ss");

    const query = `INSERT INTO public.saldos_det(fecha, usuario, id_producto,producto_text, cantidad, id_saldo)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const rta = await this.pool
      .query(query, [
        fecha_hora,
        usuario,
        producto,
        producto_text,
        cantidad,
        id_saldo,
      ])
      .catch((err) => console.log(err));
    return rta.rows;
  }
  // CREAR SALDOS
  async crear(body) {
    console.log(body);
    const usuario = body.usuario;
    const id_zona = body.zona;
    const zona_text = body.zona_text;
    const codigo = body.cod_factura;
    const fecha_hora = moment().format("YYYY-MM-DD HH:mm:ss");
    const estado = "PENDIENTE";

    const query = `INSERT INTO public.saldos(fecha, usuario, zona, zona_text, numero_factura, estado)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const rta = await this.pool
      .query(query, [
        fecha_hora,
        usuario,
        id_zona,
        zona_text,
        codigo,
        estado,
      ])
      .catch((err) => console.log(err));
    return rta.rows;
  }
  // ACTUALIZAR SALDOS
  async actualizar(idact, body) {
    console.log(body);
    const usuario = body.usuario;
    const id_zona = body.zona;
    const zona_text = body.zona_text;
    const codigo = body.cod_factura;
    const fecha_hora = moment().format("YYYY-MM-DD HH:mm:ss");
    const estado = "PENDIENTE";

    let consu = await this.validar(idact);
    if (consu == "") {
      return false;
    }
    const rta = await this.pool
      .query(
        `UPDATE public.saldos
    SET  fecha=$1, usuario=$2, zona=$3, zona_text=$4, numero_factura=$5, estado=$6 WHERE id=$7 `,
        [
          fecha_hora,
          usuario,
          id_zona,
          zona_text,
          codigo,
          estado,
          idact
        ]
      )
      .catch((err) => console.log(err));
    return rta;
  }
  // ACTUALIZAR SALDOS DETALLES
  async actualizar_saldos_det(idact, body) {
    console.log('hola');
    console.log(body);
    const usuario = body.usuario;
    const producto = body.id_producto;
    const producto_text = body.producto_text;
    const cantidad = body.cantidad;
    const id_saldo = body.id_encabezado;
    const fecha_hora = moment().format("YYYY-MM-DD HH:mm:ss");

   
    const rta = await this.pool
      .query(
        `UPDATE public.saldos_det
    SET  fecha=$1, usuario=$2, id_producto=$3, producto_text=$4, cantidad=$5, id_saldo=$6 WHERE id=$7 `,
        [
          fecha_hora,
          usuario,
          producto,
          producto_text,
          cantidad,
          id_saldo,
          idact
        ]
      )
      .catch((err) => console.log(err));
    return rta;
  }
  //BORRA SALDOS DET UNO
  
  async delete_saldos_det_uno(id_delete) {
    let consu = await this.validar_saldo_det(id_delete);
    console.log('jajajja');
    if (consu == "") {
      return false;
    }
    const rta = await this.pool
      .query(
        `DELETE FROM public.saldos_det
    WHERE id=$1`,
        [id_delete]
      )
      .catch((err) => console.log(err));
    return rta;
  }
  //BORRA SALDOS DET MASIVOS
  
  async delete_saldos_det(id_delete) {
    const rta = await this.pool
      .query(
        `DELETE FROM public.saldos_det
    WHERE id_saldo=$1`,
        [id_delete]
      )
      .catch((err) => console.log(err));
    return rta;
  }
  //ELIMINAR SALDOS
  async delete_saldos(id_delete) {
    let consu = await this.validar(id_delete);
    if (consu == "") {
      return false;
    }
    const rta = await this.pool
      .query(
        `DELETE FROM public.saldos
    WHERE id=$1`,
        [id_delete]
      )
      .catch((err) => console.log(err));
    return rta;
  }
  //CONSULTA SALDOS DETALLE POR ID SALDO
  async consult_saldos_det(data) {
    const rta = await this.pool
      .query(
        `select *, id as key from saldos_det where id_saldo = $1`,
        [data]
      )
      .catch((err) => console.log(err));
    return rta.rows;
  }
  async buscar_todos() {
    const rta = await this.pool
      .query(`SELECT *,fecha::text as fecha, numero_factura as cod_factura, id as key FROM saldos`)
      .catch((err) => console.log(err));
    return rta.rows;
  }
// CONSULTA SALDOS ID
  async validar(data) {
    const rta = await this.pool
      .query(`SELECT *, id as key FROM saldos where id=${data} `)
      .catch((err) => console.log(err));
    return rta.rows;
  }
  async validar_saldo_det(data) {
    const rta = await this.pool
      .query(`SELECT *, id as key FROM saldos_det where id=${data} `)
      .catch((err) => console.log(err));
    return rta.rows;
  }


  async buscar_uno(body) {
    const id = body.id;
    const zona = body.zona;
    const estado = body.estado;
    const fecha_ini = body.fecha_inicio;
    const fecha_fin = body.fecha_fin;
    let where = ` where 1=1`;
    // if (typeof data !== "undefined" && data !== "") {
    //   where += `  and a.zona_text::text ILIKE ('%${data}%') or a.producto_text::text ILIKE ('%${data}%') `;
    // }
    if (typeof zona !== "undefined" && zona !== "") {
      where += `  and a.zona=${zona}`;
    }
    if (typeof estado !== "undefined" && estado !== "") {
      where += `  and a.estado='${estado}'`;
    }
    if (typeof fecha_ini !== "undefined" && fecha_ini != "") {
      where += ` and a.fecha between '${fecha_ini}' and '${fecha_fin}'`;
    }
    if (typeof id !== "undefined" && id != "") {
      where += ` and a.id ='${id}'`;
    }

    const query = `select *, b.id as key from saldos a LEFT join saldos_det b on (a.id=b.id_saldo)  ${where} order by a.id desc`;
   console.log(query);
    const rta = await this.pool.query(query).catch((err) => console.log(err));
    return rta.rows;
  }



  async apply_return_fact(body) {
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
module.exports = balances_services;
