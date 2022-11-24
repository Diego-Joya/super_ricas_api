const Joi = require("joi");

const id = Joi.number();
const nombre = Joi.string().max(100);
const company = Joi.number();
const type = Joi.any();

const create_schema = Joi.object({
  nombre: nombre.required(),
  company: company.required(),
  type: type.required(),
});
const update_schema = Joi.object({
  nombre: nombre.required(),
  company: company.required(),
  type: type.required(),
});
const get_schema = Joi.object({
  nombre: nombre,
});
const delete_schema = Joi.object({
  id: id.required(),
});

module.exports = { create_schema, update_schema, get_schema, delete_schema };
