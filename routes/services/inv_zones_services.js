const boom = require("@hapi/boom");
const pool = require("./../../db/connection");
const moment = require("moment");

class inv_zones_services {
  constructor() {
    this.pool = pool;
    this.pool.on("error", (err) => console.error(err));
  }

  async crear(body) {
    const id_producto = body.id_producto;
    const id_zona = body.id_zona;
    const cantidad = body.cantidad;
    const precio_unidad = body.precio_unidad;
    const precio_total = body.precio_total;
    const codigo_producto = body.codigo_producto;
    const usuario = body.usuario;
    const fecha_hora = moment().format("YYYY-MM-DD HH:mm:ss");


    const query = `INSERT INTO public.inventario_zonas(fecha_creacion, id_producto, id_zona, cantidad, precio_unidad, precio_total, codigo_producto, usuario )
     VALUES ($1,$2,$3,$4, $5, $6, $7, $8) RETURNING *`;
    console.log(query);
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
      ])
      .catch((err) => console.log(err));
    return rta.rows;
  }

  async buscar_todos() {
    const query = `select a.*, b.nombre as nom_producto,  c.nombre as nom_zona from inventario_zonas a left join productos b on
    (a.id_producto = b.id) left join zonas c on (a.id_zona = c. id)`;
    const rta = await this.pool.query(query);
    console.log(rta.rows);
    return rta.rows;
  }

  async buscar_uno(data, fecha_ini, fecha_fin) {
    const query = `select a.*, b.nombre as nom_producto, c.nombre as nom_zona from inventario_zonas a left join productos b on
    (a.id_producto = b.id) left join zonas c on (a.id_zona = c. id)
     where b.nombre ILIKE ('%${data}%') OR c.nombre ILIKE ('%${data}%') OR b.codigo ILIKE ('%${data}%') OR a.id::text ILIKE ('%${data}% ')
     and a.fecha_creacion between '${fecha_ini}' and '${fecha_fin}'`;
   
    console.log(query);
    const rta = await this.pool.query(query);
    console.log(rta.rows.length);
    return rta.rows;
  }

  async filters(body) {
    const data = body.data;
    const fecha_ini = body.fecha_ini;
    const fecha_fin = body.fecha_fin;

    
    const query = `select a.*, b.nombre as nom_producto, c.nombre as nom_zona from inventario_zonas a left join productos b on
    (a.id_producto = b.id) left join zonas c on (a.id_zona = c. id)
     where b.nombre ILIKE ('%${data}%') OR c.nombre ILIKE ('%${data}%') OR b.codigo ILIKE ('%${data}%') OR a.id::text ILIKE ('%${data}% ')
     and a.fecha_creacion between '${fecha_ini}' and '${fecha_fin}'`;
   
    console.log(query);
    const rta = await this.pool.query(query);
    console.log(rta.rows.length);
    return rta.rows;
  }

  async actualizar(idact, body) {
    const id_producto = body.id_producto;
    const id_zona = body.id_zona;
    const cantidad = body.cantidad;
    const precio_unidad = body.precio_unidad;
    const precio_total = body.precio_total;
    const codigo_producto = body.codigo_producto;
    const usuario = body.usuario;
    const fecha_hora = moment().format("YYYY-MM-DD HH:mm:ss");
    let consu = await this.buscar_uno(idact);
    if (consu == "") {
      return false;
    }
    const rta = await this.pool
      .query(
        `UPDATE public.inventario_zonas
    SET  id_producto=$1, id_zona=$2, cantidad=$3,fecha_modificacion=$4, precio_unidad=$5, precio_total=$6, codigo_producto=$7, usuario=$8
    WHERE id=$9 `,
        [
          id_producto,
          id_zona,
          cantidad,
          fecha_hora,
          precio_unidad,
          precio_total,
          codigo_producto,
          usuario,
          idact,
        ]
      )
      .catch((err) => console.log(err));
    return body;
  }

  async delete(id_delete) {
    let consu = await this.buscar_uno(id_delete);
    if (consu == "") {
      return false;
    }
    const rta = await this.pool
      .query(
        `DELETE FROM public.inventario_zonas
    WHERE id=$1`,
        [id_delete]
      )
      .catch((err) => console.log(err));
    console.log(rta);
    return true;
  }
}
module.exports = inv_zones_services;
