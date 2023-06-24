const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const sendMail = async (url, email) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Password Reset Link',
      html: `<p>Hello,</p><p>Your password reset link is <a href="${url}"><button type="button">Click here!</button>      </a>.</p><p>or copy paste it</p><p>${url}</p>`
    }


    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('mail send Error:', error);
      } 
    });
  } catch (error) {
    return res.render('home.hbs', { alertMessage: 'Something went wrong , please retry' });
  }

}
module.exports = sendMail;

