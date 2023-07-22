// 1. smtp config
// email body
// send method

import nodemailer from "nodemailer";

export const accountVerificationEmail = async (obj) => {
  const { email } = obj;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"E Store 👻" ${process.env.SMTP_USER}`, // sender address
    to: email, // list of receivers
    subject: "Account activation required ✔", // Subject line
    text: `Hello ${fName}, please follow to activate your link`,
    html: `<p>
    Hello ${fName}
</p>

<p>
    Please follow the link below to activate your account
</p>
<br/>
<br/>
<p>
    <a href="">
    ${link}
    </a>

</p>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};
