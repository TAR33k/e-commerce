import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "E-Commerce",
      link: "https://github.com/TAR33k",
    },
  });

  const emailText = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHTML = mailGenerator.generate(options.mailgenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mail = {
    from: process.env.SMTP_FROM_EMAIL,
    to: options.email,
    subject: options.subject,
    text: emailText,
    html: emailHTML,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error("Email service failed", error);
  }
};

const emailVerificationMailgenContent = (name, verificationUrl) => {
  return {
    body: {
      name: name,
      intro: "Welcome to E-Commerce! We're excited to have you on board.",
      action: {
        instructions: "To verify your email please click the verify button.",
        button: {
          color: "#22BC66",
          text: "Verify your email address",
          link: verificationUrl,
        },
      },
    },
  };
};

const forgotPasswordMailgenContent = (name, passwordResetUrl) => {
  return {
    body: {
      name: name,
      intro: "Reset your password (E-Commerce)",
      action: {
        instructions: "To reset your password click the reset button",
        button: {
          color: "#22BC66",
          text: "Reset password",
          link: passwordResetUrl,
        },
      },
    },
  };
};

export {
  sendEmail,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
};
