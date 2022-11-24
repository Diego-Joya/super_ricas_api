const Joi = require("joi");

const id = Joi.number();
const nombre = Joi.string().min(1).max(100);
const categoria = Joi.number().integer();
const codigo_barras = Joi.any();
const porcen_comision = Joi.number();
const precio = Joi.number();
const iva = Joi.number();
const factor = Joi.any();
const unidad_medida = Joi.any();
const estado = Joi.string();
const descripcion = Joi.any();
const usuario = Joi.string().max(100);
const codigo = Joi.any();

const create_product_schema = Joi.object({
  nombre: nombre.required(),
  id_categoria: categoria.required(),
  codigo_barras: codigo_barras,
  porcen_comision: porcen_comision.required(),
  precio: precio.required(),
  iva: iva.required(),
  factor: factor,
  unidad_medida: unidad_medida,
  estado: estado,
  descripcion: descripcion,
  usuario: usuario.required(),
  codigo: codigo.required(),
  
});
const update_product_schema = Joi.object({
  nombre: nombre,
  id_categoria: categoria.required(),
  codigo_barras: codigo_barras,
  porcen_comision: porcen_comision.required(),
  precio: precio.required(),
  iva: iva,
  factor: factor,
  unidad_medida: unidad_medida,
  estado: estado.required(),
  descripcion: descripcion,
  usuario: usuario.required(),
  codigo: codigo.required(),

});
const get_product_schema = Joi.object({
  nombre:nombre,
});
const delete_product_schema = Joi.object({
  id: id.required(),
});

module.exports = {
  create_product_schema,
  update_product_schema,
  get_product_schema,
  delete_product_schema,
};
