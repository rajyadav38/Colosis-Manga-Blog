const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;

client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const api = new SibApiV3Sdk.TransactionalEmailsApi();

const sendVerificationEmail = async (email, otp) => {
  await api.sendTransacEmail({
    sender: {
      email: process.env.EMAIL_USER,
      name: "Colosis",
    },

    to: [
      {
        email,
      },
    ],

    subject: "Verify your Colosis account",

    htmlContent: `
      <div style="font-family:Arial;padding:20px">
        <h2>Welcome to Colosis 🚀</h2>

        <p>Your verification OTP is:</p>

        <div
          style="
            font-size:35px;
            font-weight:bold;
            letter-spacing:8px;
            color:#8b5cf6;
            margin:20px 0;
          "
        >
          ${otp}
        </div>

        <p>
          This OTP expires in
          <b>10 minutes</b>.
        </p>

        <p>
          Team Colosis 🚀
        </p>
      </div>
    `,
  });
};

module.exports = sendVerificationEmail;
