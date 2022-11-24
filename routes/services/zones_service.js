const boom = require("@hapi/boom");
const pool = require("./../../db/connection");
const moment = require("moment");

class zones_services {
  constructor() {
    this.pool = pool;
    this.pool.on("error", (err) => console.error(err));
  }

  async crear(body) {
    const nombre = body.nombre;
    const descripcion = body.descripcion;
    const usuario = body.usuario;
    const fecha_hora = moment().format("YYYY-MM-DD HH:mm:ss");

    const query = `INSERT INTO public.zonas(nombre, descripcion,fecha_creacion, usuario) VALUES ($1, $2, $3, $4) RETURNING *`;
    const rta = await this.pool
      .query(query, [nombre, descripcion, fecha_hora,usuario])
      .catch((err) => console.log(err));
    return rta.rows;
  }

  async buscar_todos() {
    const query = "SELECT *, id as key FROM zonas";
    const rta = await this.pool.query(query);
    return rta.rows;
  }

  async buscar_uno(data) {
    const rta = await this.pool
    .query(`SELECT *, id as key FROM zonas where nombre ILIKE ('%${data}%') OR id::text ILIKE ('%${data}%') `)
    .catch((err) => console.log(err));
  return rta.rows;
  }

  async buscar_id(data) {
    const rta = await this.pool
    .query(`SELECT *, id as key FROM zonas where id=$1`,[data])
    .catch((err) => console.log(err));
  return rta.rows;
  }
  async actualizar(idact, body) {
    let consu = await this.buscar_uno(idact);
    if(consu==''){
      return false;
    }
    const nombre = body.nombre;
    const descripcion = body.descripcion;
    const usuario = body.usuario;
    const fecha_hora = moment().format("YYYY-MM-DD HH:mm:ss");

    const rta = await this.pool
      .query(
        `UPDATE public.zonas
    SET  nombre=$1, descripcion=$2,fecha_modificacion=$3, usuario=$4
    WHERE id=$5 `,
        [nombre, descripcion, fecha_hora, usuario, idact]
      )
      .catch((err) => console.log(err));
    return body;
  }

  async delete(id_delete) {
    let consu = await this.buscar_uno(id_delete);
    if(consu==''){
      return false;
    }
    const rta = await this.pool
      .query(
        `DELETE FROM public.zonas
    WHERE id=$1`,
        [id_delete]
      )
      .catch((err) => console.log(err));
    return true;
  }
}
module.exports = zones_services;
