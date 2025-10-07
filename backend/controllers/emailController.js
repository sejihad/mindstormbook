const nodemailer = require("nodemailer");

exports.sendBulkEmail = async (req, res) => {
  try {
    const { subject, message, recipients, attachments } = req.body;

    if (!subject || !message || !recipients)
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });

    const recipientList = JSON.parse(recipients); // recipients: JSON string from frontend
    const attachmentList = attachments ? JSON.parse(attachments) : [];

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    // Map base64 attachments
    const mailAttachments = attachmentList.map((file) => ({
      filename: file.name,
      content: Buffer.from(file.data, "base64"), // base64 to buffer
    }));
    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: recipientList.join(","),
      subject,
      text: message,
      attachments: mailAttachments,
    };
    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ success: true, message: "Emails sent successfully!" });
  } catch (error) {
    console.error("Send email error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
