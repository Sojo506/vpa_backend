import nodemailer from "nodemailer";

const emailRegister = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, name, token } = data;

  // send email
  const info = await transport.sendMail({
    from: "VPA - Veterinary Patient Administrator",
    to: email,
    subject: "Verify your account on VPA",
    text: "Verify your account on VPA",
    html: `<p>Hello: ${name}, check your account on PVA</p>
    <p>Your account is ready to launch, you only need to verify the next link: <a href="${process.env.FRONTEND_URL}/confirm/${token}">verify account</a></p>

    <p>If you didn't create this account, you can ignore this message</p>
    `,
  });
};

export default emailRegister;
