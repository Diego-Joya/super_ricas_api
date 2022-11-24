const boom = require("@hapi/boom");
const pool = require("./../../db/connection");
const moment = require("moment");

class profiles_service {
  constructor() {
    this.pool = pool;
    this.pool.on("error", (err) => console.error(err));
  }

  async crear(body) {
    const nombre = body.nombre;
    const company = body.company;
    const type = body.type;
    const fecha_hora = moment().format("YYYY-MM-DD HH:mm:ss");

    const query = `INSERT INTO public.profiles(name, company, type,fecha_creacion)
     VALUES ($1, $2, $3, $4) RETURNING *`;
    const rta = await this.pool
      .query(query, [nombre, company, type,  fecha_hora])
      .catch((err) => console.log(err));
    return rta.rows;
  }

  async buscar_todos() {
    const query = "SELECT *, id as key FROM profiles";
    const rta = await this.pool.query(query);
    return rta.rows;
  }

  async buscar_uno(data) {
    const rta = await this.pool
      .query(
        `SELECT *, id as key FROM profiles where name ILIKE ('%${data}%') OR id::text ILIKE ('%${data}%') `
      )
      .catch((err) => console.log(err));
    return rta.rows;
  }
  async actualizar(idact, body) {
    const nombre = body.nombre;
    const company = body.company;
    const type = body.type;
    const fecha_hora = moment().format("YYYY-MM-DD HH:mm:ss");


    let consu = await this.buscar_uno(idact);
    if (consu == "") {
      return false;
    }
    const rta = await this.pool
      .query(
        `UPDATE public.profiles
    SET  name=$1, company=$2, type=$3, fecha_modificacion=$4
    WHERE id=$5 `,
        [nombre, company, type,  fecha_hora, idact]
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
        `DELETE FROM public.profiles
    WHERE id=$1`,
        [id_delete]
      )
      .catch((err) => console.log(err));
    return rta;
  }
}
module.exports = profiles_service;
