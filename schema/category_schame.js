const Joi = require("joi");

const id = Joi.number();
const nombre = Joi.string().min(1).max(100);
const descripcion = Joi.any();
const usuario = Joi.string().max(100);

const create_schema = Joi.object({
  nombre: nombre.required(),
  descripcion: descripcion,
  usuario: usuario.required(),
});
const update_schema = Joi.object({
  nombre: nombre,
  descripcion: descripcion,
  usuario: usuario.required(),
});
const get_schema = Joi.object({
  nombre: nombre,
});
const delete_schema = Joi.object({
  id: id.required(),
});

module.exports = { create_schema, update_schema, get_schema, delete_schema };
