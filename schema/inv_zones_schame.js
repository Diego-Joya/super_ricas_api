const Joi = require("joi");

const id = Joi.number();
const id_producto = Joi.number();
const id_zona = Joi.number();
const cantidad = Joi.number();
const precio_unidad = Joi.number();
const precio_total = Joi.number();
const codigo_producto = Joi.any();
const usuario = Joi.string().max(100);
const codigo = Joi.any();

const create_schema = Joi.object({
  id_producto: id_producto.required(),
  id_zona: id_zona.required(),
  cantidad: cantidad.required(),
  precio_unidad: precio_unidad.required(),
  precio_total: precio_total.required(),
  codigo_producto: codigo_producto.required(),
  usuario: usuario.required(),
  codigo: codigo.required(),

});
const update_schema = Joi.object({
  id_producto: id_producto.required(),
  id_zona: id_zona.required(),
  cantidad: cantidad.required(),
  precio_unidad: precio_unidad.required(),
  precio_total: precio_total.required(),
  codigo_producto: codigo_producto.required(),
  usuario: usuario.required(),
  codigo: codigo.required(),

});
const get_schema = Joi.object({
  id: id.required(),
});
const delete_schema = Joi.object({
  id: id.required(),
});

module.exports = { create_schema, update_schema, get_schema, delete_schema };
