const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"Colosis" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Colosis Password",
    html: `
      <div style="
        font-family:Arial;
        padding:20px;
      ">
        <h2>Reset Your Password</h2>

        <p>Your OTP for password reset is:</p>

        <div style="
          font-size:35px;
          font-weight:bold;
          letter-spacing:8px;
          color:#8b5cf6;
          margin:20px 0;
        ">
          ${otp}
        </div>

        <p>
          This OTP will expire in
          <b>10 minutes</b>.
        </p>

        <p>
          If you didn't request this,
          please ignore this email.
        </p>

        <br>

        <p>
          Team Colosis 🚀
        </p>
      </div>
    `,
  });
};

module.exports = sendOtpEmail;
