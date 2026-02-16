import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use a Google App Password here
  },
});

export const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
  const mailOptions = {
    from: `"Blaze Byte Admin" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email Error: ", error);
    throw new Error("Could not send verification email.");
  }
};