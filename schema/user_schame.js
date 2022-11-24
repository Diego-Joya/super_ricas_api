const Joi = require("joi");

const id = Joi.number();
const nombre = Joi.string();
const email = Joi.string().email();
const user = Joi.string();
const password = Joi.any();
const celular = Joi.number();
const company = Joi.number();
const estado = Joi.string();
const perfil = Joi.number();
const photo = Joi.any();


const create_schema = Joi.object({
  nombre: nombre.required(),
  email: email.required(),
  user: user.required(),
  password: password.required(),
  celular: celular.required(),
  company: company.required(),
  estado: estado.required(),
  perfil: perfil.required(),
  photo: photo.required(),
});
const update_schema = Joi.object({
  nombre: nombre.required(),
  email: email.required(),
  user: user.required(),
  password: password.required(),
  celular: celular.required(),
  company: company.required(),
  estado: estado.required(),
  perfil: perfil.required(),
  photo: photo.required(),
});
const get_schema = Joi.object({
  nombre: nombre,
});
const delete_schema = Joi.object({
  id: id.required(),
});

module.exports = { create_schema, update_schema, get_schema, delete_schema };
