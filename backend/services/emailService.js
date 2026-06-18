import nodemailer from "nodemailer";
import dns from "dns";

// Force Node.js to prioritize IPv4 DNS resolutions to prevent ENETUNREACH errors on cloud host environments like Render
if (dns && typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn(
      "⚠️ Email warning: EMAIL_USER and EMAIL_PASS environment variables are not set. Emails will not be sent."
    );
    return null;
  }

  try {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT, 10) || 587,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user,
        pass,
      },
    });
    return transporter;
  } catch (error) {
    console.error("❌ Failed to create email transporter:", error);
    return null;
  }
};

/**
 * Sends a formatted opportunity email notification to multiple users.
 * @param {Object} opportunity - The opportunity document.
 * @param {Array<Object>} users - List of users to receive the email.
 * @param {string} platformUrl - The base URL of the frontend platform.
 */
export const sendOpportunityEmail = async (opportunity, users, platformUrl) => {
  const client = getTransporter();
  if (!client) {
    console.warn("⚠️ SMTP Transporter is not configured. Skipping email sending.");
    return;
  }

  if (!users || users.length === 0) {
    console.log("No active users to email.");
    return;
  }

  const emails = users.map((u) => u.email).filter(Boolean);
  if (emails.length === 0) {
    console.log("No valid user emails found.");
    return;
  }

  const from = process.env.EMAIL_FROM || `"SPIT Opportunities" <no-reply@spit.ac.in>`;
  const subject = `🔥 New Opportunity: ${opportunity.title} at ${opportunity.company}`;

  const deadlineStr = opportunity.deadline
    ? new Date(opportunity.deadline).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "N/A";

  const viewUrl = `${platformUrl}/opportunities/${opportunity._id}`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; color: #1e293b; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; margin-bottom: 24px; border-bottom: 2px solid #f1f5f9; padding-bottom: 16px;">
        <h1 style="color: #4f46e5; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">SPITians Connect</h1>
        <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">New Internship/Job Opportunity Posted</p>
      </div>
      
      <div style="margin-bottom: 24px;">
        <h2 style="margin: 0 0 8px 0; color: #0f172a; font-size: 20px; font-weight: 600; line-height: 1.25;">${opportunity.title}</h2>
        <p style="margin: 0; font-size: 16px; color: #4f46e5; font-weight: 500;">at ${opportunity.company}</p>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 500; width: 35%;">Type:</td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${opportunity.type || "N/A"}</td>
          </tr>
          ${opportunity.stipend ? `
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Stipend/Salary:</td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${opportunity.stipend}</td>
          </tr>` : ""}
          ${opportunity.duration ? `
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Duration:</td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${opportunity.duration}</td>
          </tr>` : ""}
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Application Deadline:</td>
            <td style="padding: 6px 0; color: #e11d48; font-weight: 600;">${deadlineStr}</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 28px;">
        <h3 style="margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">Description</h3>
        <div style="font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap; background-color: #fafafa; border-left: 4px solid #cbd5e1; padding: 12px 16px; border-radius: 0 8px 8px 0;">${opportunity.description}</div>
      </div>

      ${opportunity.tags && opportunity.tags.length > 0 ? `
      <div style="margin-bottom: 28px;">
        <span style="font-size: 12px; color: #64748b; font-weight: 500; margin-right: 8px;">Tags:</span>
        ${opportunity.tags.flatMap(t => t.split(",")).map(t => t.trim()).filter(Boolean).map(tag => `
          <span style="display: inline-block; background-color: #e0e7ff; color: #4338ca; font-size: 12px; font-weight: 500; padding: 4px 8px; border-radius: 9999px; margin-right: 6px; margin-bottom: 6px;">#${tag}</span>
        `).join("")}
      </div>` : ""}

      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${viewUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block; transition: background-color 0.2s; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
          View Opportunity
        </a>
      </div>

      <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; text-align: center;">
        <p style="font-size: 12px; color: #94a3b8; margin: 0;">
          This is an automated notification from the SPITians Connect platform. 
          Please do not reply directly to this email.
        </p>
      </div>
    </div>
  `;

  try {
    const info = await client.sendMail({
      from,
      to: from,
      bcc: emails,
      subject,
      html: htmlContent,
    });
    console.log(`✉️ Opportunity notification emails sent successfully. Message ID: ${info.messageId}`);
  } catch (error) {
    console.error("❌ Failed to send opportunity email notifications:", error);
  }
};
