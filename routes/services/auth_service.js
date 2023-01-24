const user_services = require("./user_services");
const boom = require("@hapi/boom");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { config } = require('./../../config/config');



const service = new user_services();

class auth_services {
  async resetPasswor(mail) {
    const user = await service.consultar_email_user(mail);
    console.log(user);
    console.log("usuario ");
    if (user == "") {
      throw boom.unauthorized();
    }
    const payload ={sub:user.id};
    const token= jwt.sign(payload, config.jwtsecret, {expiresIn: '5min'});
    const link= `https://jajjaj/recovery?token=${token} `;
    const email = {
      from: "maruchispalomino@gmial.com", // sender address
      to: "yekogarcia@yahoo.com", // list of receivers
      subject: "Hello my love", // Subject line
      text: "Hello world?", // plain text body
      html:  `<b>Ingresa a este link =>${link}</b> `, // html body
    };
    const rta=await this.sendMail(email);
    return rta;
  }

  async sendMail(info) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "joya.d.f.o2017@gmail.com",
        pass: "vsbgaplxrjzjpnqa",
      },
    });

    await transporter.sendMail(info);
    return {
      ok: true,
      message: "correo enviado exitosamente",
    };
  }

  async getUser(username, password) {
    const user = await service.consultar_user(username);
    console.log(user);

    if (user == "") {
      throw boom.unauthorized();
    }
    const verify = await bcrypt.compare(password, user[0].password);
    console.log(verify);
    if (!verify) {
      throw boom.unauthorized();
    }
  }
}
module.exports = auth_services;
