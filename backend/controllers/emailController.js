const nodemailer = require("nodemailer");

exports.sendBulkEmail = async (req, res) => {
  try {
    const { subject, message, recipients, individualMode, attachments } =
      req.body;

    if (!subject || !message || !recipients)
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });

    // Parse recipients and attachments
    const recipientList = Array.isArray(recipients)
      ? recipients
      : JSON.parse(recipients);
    const attachmentList = attachments
      ? Array.isArray(attachments)
        ? attachments
        : JSON.parse(attachments)
      : [];

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
      content: Buffer.from(file.data, "base64"),
    }));

    let results = [];

    if (individualMode) {
      // Single email send - individual mode
      const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: recipientList[0], // শুধুমাত্র প্রথম recipient
        subject: subject,
        text: message,
        attachments: mailAttachments,
      };

      try {
        const result = await transporter.sendMail(mailOptions);
        results.push({
          email: recipientList[0],
          status: "sent",
          messageId: result.messageId,
        });

        console.log(`Email sent individually to: ${recipientList[0]}`);
      } catch (error) {
        results.push({
          email: recipientList[0],
          status: "failed",
          error: error.message,
        });
        console.error(`Failed to send email to ${recipientList[0]}:`, error);
      }
    } else {
      // Bulk email - কিন্তু প্রতিটি user এর জন্য আলাদা email
      for (const recipient of recipientList) {
        const individualMailOptions = {
          from: process.env.SMTP_MAIL,
          to: recipient, // শুধুমাত্র এই user এর email
          subject: subject,
          text: message,
          attachments: mailAttachments,
        };

        try {
          const result = await transporter.sendMail(individualMailOptions);
          results.push({
            email: recipient,
            status: "sent",
            messageId: result.messageId,
          });
        } catch (error) {
          results.push({
            email: recipient,
            status: "failed",
            error: error.message,
          });
        }

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    // Check if any emails failed
    const failedEmails = results.filter((result) => result.status === "failed");

    if (failedEmails.length > 0) {
      return res.status(207).json({
        success: true,
        message: `Emails sent with ${failedEmails.length} failures`,
        results: results,
      });
    }

    res.status(200).json({
      success: true,
      message: `All ${results.length} emails sent successfully!`,
      results: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
