import nodemailer from "nodemailer";
import config from "../config/env.config";

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465, // true for port 465 (SSL), false for 587 (TLS)
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

/**
 * Sends a 6-digit OTP to the user's email for verification.
 */
export const sendVerificationEmail = async (
  to: string,
  name: string,
  otp: string,
): Promise<void> => {
  await transporter.sendMail({
    from: `"Artiste Meetup" <${config.email.from}>`,
    to,
    subject: "Verify your email – Artiste Meetup",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Hello, ${name}!</h2>
        <p>Use the OTP below to verify your email address. It expires in <strong>10 minutes</strong>.</p>
        <div style="
          font-size: 36px;
          font-weight: bold;
          letter-spacing: 12px;
          text-align: center;
          padding: 20px;
          background: #f4f4f4;
          border-radius: 8px;
          margin: 24px 0;
        ">
          ${otp}
        </div>
        <p style="color: #666; font-size: 13px;">
          If you did not create an account, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};
