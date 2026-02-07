import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateInvoice = async (payment, user, plan) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();

      // ✅ Absolute invoices folder
      const invoicesDir = path.join(__dirname, "..", "invoices");
      if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir);
      }

      // ✅ Absolute file path (THIS fixes your crash)
      const filePath = path.join(invoicesDir, `invoice-${payment._id}.pdf`);

      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // =========================
      // INVOICE CONTENT
      // =========================
      doc.fontSize(20).text("MikroTik Billing Invoice", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`Invoice ID: ${payment._id}`);
      doc.text(`Date: ${new Date(payment.createdAt).toLocaleDateString()}`);
      doc.text(`Customer: ${user.name} (${user.email})`);
      doc.text(`Plan: ${plan.name}`);
      doc.text(`Amount: KES ${payment.amount}`);
      doc.text(`Payment Status: ${payment.status}`);
      doc.text(`Transaction ID: ${payment.transactionId}`);

      doc.moveDown();
      doc.text("Thank you for your payment!", { align: "center" });

      doc.end();

      // ✅ Only return filePath (NO "invoice" variable here)
      writeStream.on("finish", () => {
        console.log("🧾 Invoice PDF generated:", filePath);
        resolve(filePath);
      });
    } catch (err) {
      reject(err);
    }
  });
};
