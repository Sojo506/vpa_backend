import nodemailer from "nodemailer";

const emailForgotPassword = async (data) => {
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
    subject: "Reset your password",
    html: `<p>Hello: ${name}, you have requested to reset your password</p>
    <p>Follow the next link to generate a new password:</p>
    <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Reset Password</a>
    <p>If you didn't create this account, you can ignore this message</p>
    <p>Best,</p>
    <p>VPA</p>
    `,
  });
};

export default emailForgotPassword;
