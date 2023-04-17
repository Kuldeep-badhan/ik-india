import nodemailer from "nodemailer";

export default async function handler(req, res) {
  const { firstName, lastName, email, message } = req.body;
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
    pool: true, // enable connection pooling
  });
  const mailOptions = {
    from: "iksolution4186@gmail.com",
    to: process.env.TO_EMAIL,
    subject: `Message from IK Website Contact Form`,
    text: `First Name: ${firstName}\n\nLast Name: ${lastName}\n\nEmail: ${email}\n\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending message" });
  }
}
