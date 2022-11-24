// const boom = require("@hapi/boom");
const pool = require("./../../db/connection");
const moment = require("moment");

class category_service {
  constructor() {
    this.pool = pool;
    this.pool.on("error", (err) => console.error(err));
  }

  async crear(body) {
    const nombre = body.nombre;
    const descripcion = body.descripcion;
    const fecha_hora = moment().format("YYYY-MM-DD HH:mm:ss");
    const usuario = body.usuario;

    const query = `INSERT INTO public.categorias(nombre, descripcion, fecha_creacion, usuario)
     VALUES ($1, $2, $3, $4) RETURNING *`;
    const rta = await this.pool
      .query(query, [nombre, descripcion, fecha_hora,  usuario])
      .catch((err) => console.log(err));
    return rta.rows;
  }

  async buscar_todos() {
    const query = "SELECT *, id as key FROM categorias";
    const rta = await this.pool.query(query);
    return rta.rows;
  }

  async buscar_uno(data) {
    const rta = await this.pool
      .query(
        `SELECT *, id as key FROM categorias where nombre ILIKE ('%${data}%') OR id::text ILIKE ('%${data}%') `
      )
      .catch((err) => console.log(err));
    return rta.rows;
  }
  async actualizar(idact, body) {
    const nombre = body.nombre;
    const descripcion = body.descripcion;
    const usuario = body.usuario;
    const fecha_hora = moment().format("YYYY-MM-DD HH:mm:ss");


    let consu = await this.buscar_uno(idact);
    if (consu == "") {
      return false;
    }
    const rta = await this.pool
      .query(
        `UPDATE public.categorias
    SET  nombre=$1, descripcion=$2, usuario=$3, fecha_modificacion=$4
    WHERE id=$5 `,
        [nombre, descripcion, usuario, fecha_hora, idact]
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
        `DELETE FROM public.categorias
    WHERE id=$1`,
        [id_delete]
      )
      .catch((err) => console.log(err));
    return rta;
  }
}
module.exports = category_service;
