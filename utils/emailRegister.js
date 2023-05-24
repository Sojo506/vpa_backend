import nodemailer from "nodemailer";

const emailRegister = async (data) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, name, token } = data;

  // send email
  const info = await transport.sendMail({
    from: "VPA - Veterinary Patient Administrator 💻",
    to: email,
    subject: "Please, verify your email address",
    html: `
        <p>Follow the next link to confirm your account:</p>
        <a href="${process.env.FRONTEND_URL}/confirm/${token}">Confirm Account</a>
        <p>If you didn't create this account, you can ignore this message.</p>
        <p>Best,</p>
        <p>VPA</p>
      `,
  });
};

export default emailRegister;
