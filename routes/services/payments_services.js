// const boom = require("@hapi/boom");
const pool = require("./../../db/connection");
const moment = require("moment");

class payments_service {
  constructor() {
    this.pool = pool;
    this.pool.on("error", (err) => console.error(err));
  }

  async crear(body) {
    const usuario = body.usuario;
    const id_iventario = body.id_iventario;
    const id_zona = body.id_zona;
    const valor = body.valor;
    const fecha = body.fecha;
    const fecha_hora = moment().format("YYYY-MM-DD HH:mm:ss");

    const query = `INSERT INTO public.pago(usuario, id_iventario, id_zona, valor, fecha_creacion, fecha)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const rta = await this.pool
      .query(query, [usuario, id_iventario, id_zona, valor,fecha_hora, fecha ])
      .catch((err) => console.log(err));
    return rta.rows;
  }

  async buscar_todos() {
    const query = "SELECT *, id as key FROM pago";
    const rta = await this.pool.query(query);
    return rta.rows;
  }
  async consult_invetario_zonas_det(data) {
    console.log(data);
    const rta = await this.pool
      .query(
        `SELECT *,fecha::text as fecha, id as key FROM pago where id_iventario = $1`,
        [data]
      )
      .catch((err) => console.log(err));
    return rta.rows;
  }

  async buscar_uno(data) {
    const rta = await this.pool
      .query(
        `SELECT *,fecha::text as fecha, id as key FROM pago where  id::text ILIKE ('%${data}%') `
      )
      .catch((err) => console.log(err));
    return rta.rows;
  }
  async actualizar(idact, body) {
    const usuario = body.usuario;
    const id_iventario = body.id_iventario;
    const id_zona = body.id_zona;
    const valor = body.valor;
    const fecha = body.fecha;
    const fecha_hora = moment().format("YYYY-MM-DD HH:mm:ss");


    let consu = await this.buscar_uno(idact);
    if (consu == "") {
      return false;
    }
    const rta = await this.pool
      .query(
        `UPDATE public.pago
    SET  usuario=$1, id_iventario=$2, id_zona=$3, valor=$4, fecha_modificacion=$5, fecha=$6
    WHERE id=$7 `,
        [usuario, id_iventario, id_zona, valor,fecha_hora, fecha,  idact]
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
        `DELETE FROM public.pago
    WHERE id=$1`,
        [id_delete]
      )
      .catch((err) => console.log(err));
    return rta;
  }
}
module.exports = payments_service;
