// const boom = require("@hapi/boom");
// const { now } = require("moment/moment");
const pool = require("../../db/connection");
const moment = require("moment");
// const { query } = require("express");

// const sequelize = require('./../../db/sequelize')

class Invetario_detalle {
  constructor() {
    this.pool = pool;
    this.pool.on("error", (err) => console.error(err));
  }
  async actualizar(idact, body) {
    const fecha = body.fecha_dia;
    const id_zona = body.id_zona;
    const zona_text = body.zona_text;
    const usuario = body.usuario;
    const codigo = body.codigo;
    const estado = "INGRESADA";
    const saldo_base = body.saldo_base;

    const fecha_hora = moment().format("YYYY-MM-DD HH:mm:ss");

    const rta = await this.pool
      .query(
        `UPDATE public.inventario_zonas
        SET id_zona=$1, fecha_modificacion=$2,  fecha_dia=$3, usuario=$4, estado=$5, saldo_base=$6, zona_text=$7, codigo=$8  WHERE id=$9`,
        [
          id_zona,
          fecha_hora,
          fecha,
          usuario,
          estado,
          saldo_base,
          zona_text,
          codigo,
          idact,
        ]
      )
      .catch((err) => console.log(err));

    return body;
  }
  async actualizar_estado_inventario(idact) {
    const estado = "COMPLETADO";
    const fecha_hora = moment().format("YYYY-MM-DD HH:mm:ss");

    const rta = await this.pool
      .query(
        `UPDATE public.inventario_zonas
        SET estado=$1 WHERE id=$2`,
        [estado, idact]
      )
      .catch((err) => console.log(err));

    return true;
  }

  async crear_inv_zona(body) {
    const fecha = body.fecha_dia;
    const id_zona = body.id_zona;
    const zona_text = body.zona_text;
    const usuario = body.usuario;
    const saldo_base = body.saldo_base;
    const codigo = body.codigo;

    const estado = "INGRESADA";

    const fecha_hora = moment().format("YYYY-MM-DD HH:mm:ss");

    const query = `INSERT INTO public.inventario_zonas(id_zona, fecha_creacion, fecha_dia, usuario, estado, saldo_base, zona_text,codigo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *, fecha_dia::text as fecha_dia`;

    const rta = await this.pool
      .query(query, [
        id_zona,
        fecha_hora,
        fecha,
        usuario,
        estado,
        saldo_base,
        zona_text,
        codigo,
      ])
      .catch((err) => console.log(err));
    return rta.rows;
  }

  async actualizar_det(idact, body) {
    const id_producto = body.id_producto;
    const id_zona = body.id_zona;
    const cantidad = body.cantidad;
    const precio_unidad = body.precio_unidad;
    const precio_total = body.precio_total;
    const codigo_producto = body.codigo_producto;
    const usuario = body.usuario;
    const id_invetario = body.id_invetario;
    const porcen_comision = body.porcen_comision;
    const cantidad_salida = body.cantidad_salida;
    const valor_iva = body.valor_iva;
    const valor_comision = body.valor_comision;
    const valor_venta = body.valor_venta;
    const nomb_producto = body.nomb_producto;

    const iva = body.iva;
    const fecha_hora = moment().format("YYYY-MM-DD HH:mm:ss");
    const fecha_salida = moment().format("YYYY-MM-DD HH:mm:ss");
    let estado = "";
    if (parseInt(cantidad - cantidad_salida) == 0) {
      estado = "SALIDA";
    } else {
      estado = "INGRESADA";
    }

    const rta = await this.pool
      .query(
        `UPDATE public.inventario_zonas_det
        SET id_producto=$1, id_zona=$2, cantidad=$3, fecha_modificacion=$4, cantidad_salida=$5,
         precio_unidad=$6, precio_total=$7, codigo_producto=$8, usuario=$9, id_inventario=$10, 
         porcen_comision=$11, iva=$12, estado=$13, fecha_salida=$14, valor_comision=$15,valor_venta=$16,valor_iva=$17, producto_text=$18 where  id=$19`,
        [
          id_producto,
          id_zona,
          cantidad,
          fecha_hora,
          cantidad_salida,
          precio_unidad,
          precio_total,
          codigo_producto,
          usuario,
          id_invetario,
          porcen_comision,
          iva,
          estado,
          fecha_salida,
          valor_comision,
          valor_venta,
          valor_iva,
          nomb_producto,
          idact,
        ]
      )
      .catch((err) => console.log(err));

    return body;
  }

  async crear_inv_det(body) {
    console.log(body);
    const id_producto = body.id_producto;
    const id_zona = body.id_zona;
    const cantidad = body.cantidad;
    const precio_unidad = body.precio_unidad;
    const precio_total = body.precio_total;
    const codigo_producto = body.codigo_producto;
    const usuario = body.usuario;
    const id_invetario = body.id_invetario;
    const porcen_comision = body.porcen_comision;
    const iva = body.iva;
    const valor_venta = body.valor_venta;
    const valor_comision = body.valor_comision;
    const valor_iva = body.valor_iva;
    const nomb_producto = body.nomb_producto;
    const estado = "INGRESADA";
    const cantidad_salida = "0";
    const fecha_hora = moment().format("YYYY-MM-DD HH:mm:ss");

    const query = `INSERT INTO public.inventario_zonas_det(  fecha_creacion, id_producto, id_zona, cantidad,
      precio_unidad, precio_total, codigo_producto, usuario, id_inventario, porcen_comision, iva,
       estado,cantidad_salida,valor_venta,valor_comision,valor_iva,producto_text)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`;

    const rta = await this.pool
      .query(query, [
        fecha_hora,
        id_producto,
        id_zona,
        cantidad,
        precio_unidad,
        precio_total,
        codigo_producto,
        usuario,
        id_invetario,
        porcen_comision,
        iva,
        estado,
        cantidad_salida,
        valor_venta,
        valor_comision,
        valor_iva,
        nomb_producto,
      ])
      .catch((err) => console.log(err));

    return rta.rows;
  }

  // CONSULTA FILTRO
  async consult_invetario_zonas(body) {
    const fecha_ini = body.fecha_inicio;
    const fecha_fin = body.fecha_fin;
    const zona = body.id_zona;
    console.log(fecha_ini);
    let where = ` where 1=1`;
    if (typeof fecha_ini !== "undefined" && fecha_ini != "") {
      where += ` and a.fecha_dia between '${fecha_ini}' and '${fecha_fin}'`;
    }
    if (typeof zona !== "undefined") {
      where += ` and b.id ='${zona}'`;
    }
    console.log(where);
    const query = `select a.*,((select sum(valor_venta::double precision)  from inventario_zonas_det where  id_inventario=a.id) + a.saldo_base
  )as valor_venta,((select sum(precio_total::double precision)  from inventario_zonas_det where  id_inventario=a.id
    )+ a.saldo_base) as precio_total,
	(select sum(valor_comision::double precision)  from inventario_zonas_det where  id_inventario=a.id
    )as valor_comision,(select sum(valor_iva::double precision)  from inventario_zonas_det where  id_inventario=a.id
    )as valor_iva,(select sum(valor::double precision)  from pago where  id_iventario=a.id and concepto='INGRESO'
    )as valor_ingresos,((select sum(valor_venta::double precision)  from inventario_zonas_det where  id_inventario=a.id) -
						(select sum(valor::double precision)  from pago where  id_iventario=a.id and concepto='INGRESO'
    ))as valor_pendiente,a.fecha_dia::text as fecha_dia, a.id as key, b.nombre as zona_text,(select sum(valor::double precision)  from pago where  id_iventario=a.id and concepto='FIADO'
    )as fiado
     from inventario_zonas a LEFT join zonas b on (a.id_zona=b.id) ${where} order by id desc`;

    const rta = await this.pool.query(query);
    console.log(rta.rows.length);
    return rta.rows;
  }

  async consult_invetario_zonas_id(data) {
    const rta = await this.pool
      .query(
        `select a.*,((select sum(valor_venta::double precision)  from inventario_zonas_det where  id_inventario=a.id) + a.saldo_base
        )as valor_venta,(select sum(precio_total::double precision)  from inventario_zonas_det where  id_inventario=a.id
        )as precio_total, (select sum(valor_comision::double precision)  from inventario_zonas_det where  id_inventario=a.id
        )as valor_comision,(select sum(valor_iva::double precision)  from inventario_zonas_det where  id_inventario=a.id
        )as valor_iva,(select sum(valor::double precision)  from pago where  id_iventario=a.id
        )as valor_ingresos,((select sum(precio_total::double precision)  from inventario_zonas_det where  id_inventario=a.id) - (select sum(valor::double precision)  from pago where  id_iventario=a.id
        ))as valor_pendiente,a.fecha_dia::text as fecha_dia, a.id as key, b.nombre as zona_text
         from inventario_zonas a LEFT join zonas b on (a.id_zona=b.id) where a.id = $1`,
        [data]
      )
      .catch((err) => console.log(err));
    return rta.rows;
  }

  async consult_invetario_zonas_det(data) {
    const rta = await this.pool
      .query(
        `select a.*, a.id as key, b.nombre as zona_text,c.nombre as nomb_producto from inventario_zonas_det a LEFT join zonas b on (a.id_zona=b.id)
    left join productos c on (a.id_producto = c.id) where a.id_inventario = $1`,
        [data]
      )
      .catch((err) => console.log(err));
    return rta.rows;
  }

  async consult_invetario_cantidades(data) {
    const rta = await this.pool
      .query(
        `select sum(cantidad::integer) as cantidad, sum (cantidad_salida::integer) as cantidad_salidad from inventario_zonas_det where id_inventario = $1`,
        [data]
      )
      .catch((err) => console.log(err));
    return rta.rows;
  }

  async consult_invetario_zonas_det_id(data) {
    const rta = await this.pool
      .query(
        `select a.*, a.id as key, b.nombre as zona_text,c.nombre as nomb_producto from inventario_zonas_det a LEFT join zonas b on (a.id_zona=b.id)
    left join productos c on (a.id_producto = c.id) where a.id = $1`,
        [data]
      )
      .catch((err) => console.log(err));
    return rta.rows;
  }

  async validar(data) {
    const rta = await this.pool
      .query(`SELECT *, id as key FROM productos where id=${data} `)
      .catch((err) => console.log(err));
    return rta.rows;
  }

  async delete_invetario_zonas_det(id_delete) {
    const rta = await this.pool
      .query(
        `DELETE FROM public.inventario_zonas_det
    WHERE id=$1`,
        [id_delete]
      )
      .catch((err) => console.log(err));
    return true;
  }

  async delete_invetario_zonas(id_delete) {
    const rta = await this.pool
      .query(
        `DELETE FROM public.inventario_zonas
    WHERE id=$1`,
        [id_delete]
      )
      .catch((err) => console.log(err));
    return true;
  }
}

module.exports = Invetario_detalle;
