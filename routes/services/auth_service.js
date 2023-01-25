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
    console.log( user[0].id);
    if (user == "") {
      throw boom.unauthorized();
    }
    const payload ={sub: user[0].id};
    const token= jwt.sign(payload, config.jwtsecret, {expiresIn: '10min'});
    const saveToken= await service.Guardartoken(user[0].id, token)
    // return saveToken;
    const link= `https://controlsinventarios.com/recovery?token=${token} `;
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
        // pass: "vsbgaplxrjzjpnqa",
        pass: "tyejjglansbcwzzm",
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

  async changePassword(token, newpassword){
    try {
      const payload= jwt.verify(token, config.jwtsecret);
      console.log(payload);
      const user = await service.buscar_uno(payload.sub);
      console.log(user);
    if (user[0].token !== token) {
      throw boom.unauthorized();
    }
      const actualizar= await service.actualizar_password(payload.sub,newpassword);
      return {
        ok: true,
        message:'Password cambiado exitosamente!'
      }
    } catch (error) {
      throw boom.unauthorized();
    }

  }
}
module.exports = auth_services;
