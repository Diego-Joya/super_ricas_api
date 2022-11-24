const boom = require("@hapi/boom");
const { now } = require("moment/moment");
const pool = require("./../../db/connection");
const moment = require("moment");

// const sequelize = require('./../../db/sequelize')

class Products_services {
  constructor() {
    this.pool = pool;
    this.pool.on("error", (err) => console.error(err));
  }

  async crear(body) {
    console.log(body);
    const nombre = body.nombre;
    const id_categoria = body.id_categoria;
    const codigo_barras = body.codigo_barras;
    const precio = body.precio;
    const porcen_comision = body.porcen_comision;
    const iva = body.iva;
    const factor = body.factor;
    const unidad_medida = body.unidad_medida;
    const estado = body.estado;
    const descripcion = body.descripcion;
    const usuario = body.usuario;
    const codigo = body.codigo;
    const fecha_hora = moment().format("YYYY-MM-DD HH:mm:ss");


    const query = `INSERT INTO public.productos(
      nombre, id_categoria, codigo_barras, precio, porcen_comision, iva, factor, unidad_medida,estado, descripcion, fecha_creacion,usuario,codigo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`;

    const rta = await this.pool
      .query(query, [
        nombre,
        id_categoria,
        codigo_barras,
        precio,
        porcen_comision,
        iva,
        factor,
        unidad_medida,
        estado,
        descripcion,
        fecha_hora,
        usuario,
        codigo
      ])
      .catch((err) => console.log(err));

    return rta.rows;
  }

  async buscar_todos() {
    const query = "SELECT a.*, b.nombre as categoria_text, a.id as key FROM productos a left join categorias b on (a.id_categoria=b.id)";
    const rta = await this.pool.query(query);
    return rta.rows;
  }
  
  async buscar_uno(data) {
    const rta = await this.pool
      .query(`SELECT a.*, b.nombre as categoria_text, a.id as key FROM productos a left join categorias b on (a.id_categoria=b.id) where  a.id::text ILIKE ('%${data}%') OR a.nombre ILIKE ('%${data}%') OR a.codigo ILIKE ('%${data}%') OR a.precio::text ILIKE ('%${data}%') `)
      .catch((err) => console.log(err));
    return rta.rows;
  }

  async buscar_id(data) {
    const rta = await this.pool
      .query(`SELECT a.*, b.nombre as categoria_text, a.id as key FROM productos a
       left join categorias b on (a.id_categoria=b.id) where  a.id=$1`,[data])
      .catch((err) => console.log(err));
    return rta.rows;
  }

  async concatenar_prod() {
    const query = "SELECT id,  (codigo || '-' || nombre) AS nombre  FROM productos";
    console.log(query);
    const rta = await this.pool.query(query);
    return rta.rows;
  }

  async validar(data) {
    const rta = await this.pool
      .query(`SELECT *, id as key FROM productos where id=${data} `)
      .catch((err) => console.log(err));
    return rta.rows;
  }
  async actualizar(idact, body) {
    console.log(body);
    let consu = await this.validar(idact);
    if (consu == "") {
      return false;
    }
    const nombre = body.nombre;
    const id_categoria = body.id_categoria;
    const codigo_barras = body.codigo_barras;
    const precio = body.precio;
    const porcen_comision = body.porcen_comision;
    const iva = body.iva;
    const factor = body.factor;
    const unidad_medida = body.unidad_medida;
    const estado = body.estado;
    const descripcion = body.descripcion;
    const usuario = body.usuario;
    const codigo = body.codigo;
    const fecha_hora = moment().format("YYYY-MM-DD HH:mm:ss");
    


    // const fecha_hora = moment().format("DD/MM/YYYY HH:mm:ss");

    const rta = await this.pool
      .query(
        `UPDATE public.productos
    SET  nombre=$1, id_categoria=$2, codigo_barras=$3, precio=$4, porcen_comision=$5, iva=$6, factor=$7,
     unidad_medida=$8,estado=$9,descripcion=$10,fecha_modificacion=$11,usuario=$12, codigo=$13
    WHERE id=$14 `,
        [
          nombre,
          id_categoria,
          codigo_barras,
          precio,
          porcen_comision,
          iva,
          factor,
          unidad_medida,
          estado,
          descripcion,
          fecha_hora,
          usuario,
          codigo,
          idact,
        ]
      )
      .catch((err) => console.log(err));

    return body;
  }

  async delete_product(id_delete) {
    let consu = await this.validar(id_delete);
    if (consu == "") {
      return false;
    }
    const rta = await this.pool
      .query(
        `DELETE FROM public.productos
    WHERE id=$1`,
        [id_delete]
      )
      .catch((err) => console.log(err));
    return true;
  }
}
module.exports = Products_services;
