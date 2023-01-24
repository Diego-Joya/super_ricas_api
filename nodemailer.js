
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function sendMail() {
 
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user:'joya.d.f.o2017@gmail.com',
      pass: 'vsbgaplxrjzjpnqa'
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'maruchispalomino@gmial.com', // sender address
    to: 'joya.d.f.o2017@gmail.com', // list of receivers
    subject: "Hello my love", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

sendMail();
