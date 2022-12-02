// const boom = require("@hapi/boom");
const pool = require("./../../db/connection");
const moment = require("moment");
const bcrypt = require("bcrypt");
// const { query } = require("express-validator");

class user_service {
  constructor() {
    this.pool = pool;
    this.pool.on("error", (err) => console.error(err));
  }

  async crear(body) {
    const nombre = body.nombre;
    const email = body.email;
    const user = body.user;
    const password_enc = body.password;
    const celular = body.celular;
    const company = body.company;
    const estado = body.estado;
    const perfil = body.perfil;
    const photo = body.photo;
    const fecha_hora = moment().format("YYYY-MM-DD HH:mm:ss");
    const password = await bcrypt.hash(password_enc, 10);

    const query = `INSERT INTO public.users(name, email, user_login, password, cell_phone,
       create_datetime, activate_datetime, company, state, id_profile, photo)
     VALUES ($1, $2, $3, $4,$5, $6 ,$7, $8, $9, $10, $11) RETURNING *`;
    const rta = await this.pool
      .query(query, [
        nombre,
        email,
        user,
        password,
        celular,
        fecha_hora,
        fecha_hora,
        company,
        estado,
        perfil,
        photo,
      ])
      .catch((err) => console.log(err));
    return rta.rows;
  }

  async buscar_todos() {
    const query =
      "SELECT a.*, a.id as key, b.name as profile_text FROM users a left join  profiles b on (a.id_profile = b.id)";
    const rta = await this.pool.query(query);
    return rta.rows;
  }

  async buscar_uno(data) {
    const rta = await this.pool
      .query(
        `SELECT *, id as key FROM users where name LIKE ('%${data}%') OR id::text LIKE ('%${data}%') `
      )
      .catch((err) => console.log(err));
    return rta.rows;
  }
  async consultar_user(data) {
    const rta = await this.pool
      .query(
        `SELECT a.user_login,a.company,a.id_profile,a.password,a.photo, a.id as key,b.name FROM users a left join 
        profiles b on (a.id_profile=b.id) where user_login=$1`,
        [data]
      )
      .catch((err) => console.log(err));
    console.log(rta.rows);
    return rta.rows;
  }

  async validar(data) {
    const rta = await this.pool
      .query(`SELECT *, id as key FROM users where id=${data} `)
      .catch((err) => console.log(err));
    return rta.rows;
  }
  async consulta_password(data) {
    const rta = await this.pool
      .query(`SELECT password, id as key FROM users where id=${data} `)
      .catch((err) => console.log(err));
    return rta.rows;
  }
  async actualizar_profile(idact, body) {
    const nombre = body.name;
    const email = body.email;
    const user = body.user_login;
    const celular = body.cell_phone;
    const photo = body.photo;
    const fecha_hora = moment().format("YYYY-MM-DD HH:mm:ss");

    let consu = await this.validar(idact);
    if (consu == "") {
      return false;
    }
    if (typeof body.password != "undefined") {
      const password_enc = body.password;
    const password = await bcrypt.hash(password_enc, 10);

      let rta = await this.pool
        .query(
          `UPDATE public.users
    SET name=$1, email=$2, user_login=$3, password=$4, cell_phone=$5, photo=$6,fecha_modificacion=$7
    WHERE id=$8`,
          [nombre, email, user, password, celular, photo, fecha_hora, idact]
        )
        .catch((err) => console.log(err));
      return rta;
    } else {
      let rta = await this.pool
        .query(
          `UPDATE public.users
    SET name=$1, email=$2, user_login=$3, cell_phone=$4, photo=$5,fecha_modificacion=$6
    WHERE id=$7`,
          [nombre, email, user, celular, photo, fecha_hora, idact]
        )
        .catch((err) => console.log(err));
      return rta;
    }
  }

  async actualizar(idact, body) {
    const nombre = body.nombre;
    const email = body.email;
    const user = body.user;
    const password = body.password;
    const celular = body.celular;
    const estado = body.estado;
    const perfil = body.perfil;
    const photo = body.photo;
    const fecha_hora = moment().format("YYYY-MM-DD HH:mm:ss");

    let consu = await this.validar(idact);
    if (consu == "") {
      return false;
    }
    const rta = await this.pool
      .query(
        `UPDATE public.users
    SET name=$1, email=$2, user_login=$3, password=$4, cell_phone=$5,
     activate_datetime=$6,  state=$7, id_profile=$8, photo=$9
    WHERE id=$10`,
        [
          nombre,
          email,
          user,
          password,
          celular,
          fecha_hora,
          estado,
          perfil,
          photo,
          idact,
        ]
      )
      .catch((err) => console.log(err));

    return rta;
  }

  async delete(id_delete) {
    let consu = await this.validar(id_delete);
    if (consu == "") {
      return false;
    }
    const rta = await this.pool
      .query(
        `DELETE FROM public.users
    WHERE id=$1`,
        [id_delete]
      )
      .catch((err) => console.log(err));
    return rta;
  }
}
module.exports = user_service;
