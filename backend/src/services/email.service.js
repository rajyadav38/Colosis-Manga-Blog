// src/services/email.service.js

const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;

client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendOtpEmail = async (email, otp) => {
  const sendSmtpEmail = {
    sender: {
      name: "Colosis",
      email: process.env.EMAIL_USER,
    },

    to: [
      {
        email,
      },
    ],

    subject: "Reset Your Colosis Password",

    htmlContent: `
      <div style="font-family:Arial;padding:30px;">
        <h2>Reset Your Password</h2>

        <p>Your OTP is:</p>

        <h1 style="
          color:#8b5cf6;
          letter-spacing:8px;
          font-size:42px;
        ">
          ${otp}
        </h1>

        <p>
          This OTP will expire in
          <b>10 minutes</b>.
        </p>

        <br>

        <p>
          Team Colosis 🚀
        </p>
      </div>
    `,
  };

  await apiInstance.sendTransacEmail(sendSmtpEmail);

  console.log("OTP Email Sent");
};

module.exports = sendOtpEmail;
