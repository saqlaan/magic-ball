const nodemailer = require('nodemailer');

const MailService = () => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'usamaijazksr@gmail.com',
      pass: 'usama.0900'
    }
  });
  function send(mailOptions) {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
  return {send}
}
module.exports = MailService;
