import { jsPDF } from "jspdf";
import invoiceBg from "../assets/invoice-bg.png"; // PNG version

export const generateInvoicePDF = async (data) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  let y = 25;

  /* ================= BACKGROUND ================= */
  doc.addImage(invoiceBg, "PNG", 0, 0, pageWidth, pageHeight);

  /* ================= HEADER ================= */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(0);
  doc.text("INVOICE", pageWidth - margin, y, { align: "right" });

  y += 15;

  /* ================= FROM / TO ================= */
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("FROM", margin, y);
  doc.text("TO", pageWidth - margin, y);

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text(data.from.address, margin, y, { maxWidth: 85 });

  doc.text(
    `${data.to.name}\n${data.to.place}\n${data.to.phone}`,
    pageWidth - margin,
    y,
    { align: "right" }
  );

  y += 30;

  /* ================= META ================= */
  doc.setLineWidth(0.8);
  doc.rect(margin, y, pageWidth - margin * 2, 10);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);

  doc.text(
    `INVOICE DATE : ${new Date(data.invoice.invoiceDate)
      .toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
      .toUpperCase()}`,
    margin + 4,
    y + 7
  );

  doc.text(
    `INVOICE ID : ${data.invoice.invoiceNo}`,
    pageWidth - margin - 4,
    y + 7,
    { align: "right" }
  );

  y += 16;

  /* ================= TABLE ================= */
  const col = {
    no: margin + 2,
    desc: margin + 12,
    price: margin + 112,
    offer: margin + 140,
    total: margin + 175,
  };

  // Header
  doc.setFillColor(107, 76, 122);
  doc.rect(margin, y, pageWidth - margin * 2, 8, "F");
  doc.setTextColor(255);
  doc.setFontSize(10);

  doc.text("NO", col.no, y + 5);
  doc.text("DESCRIPTION", col.desc, y + 5);
  doc.text("PRICE", col.price, y + 5, { align: "right" });
  doc.text("OFFER", col.offer, y + 5, { align: "right" });
  doc.text("TOTAL", col.total, y + 5, { align: "right" });

  y += 10;
  doc.setFontSize(9);
  doc.setTextColor(0);
  doc.setFont("helvetica", "normal");

  /* ================= ROWS ================= */
  data.items.forEach((item, i) => {
    doc.setFillColor(242, 246, 255);
    doc.rect(margin, y - 4, pageWidth - margin * 2, 8, "F");

    doc.text(String(i + 1), col.no, y);

    const descLines = doc.splitTextToSize(item.description, 90);
    doc.text(descLines, col.desc, y);

    doc.text(
      item.priceLabel
        ? item.priceLabel
        : `₹ ${item.price.toLocaleString()}`,
      col.price,
      y,
      { align: "right" }
    );

    doc.text(`${item.offer}%`, col.offer, y, { align: "right" });
    doc.text(`₹ ${item.total.toLocaleString()}`, col.total, y, {
      align: "right",
    });

    y += Math.max(8, descLines.length * 5);
  });

  y += 6;

  /* ================= SUMMARY ================= */
  doc.setFont("helvetica", "bold");

  doc.setFillColor(254, 243, 199);
  doc.rect(margin, y, 110, 10, "F");
  doc.setTextColor(217, 119, 6);
  doc.text(
    "👑 1 Year of Premium Features — Absolutely Free",
    margin + 55,
    y + 7,
    { align: "center" }
  );

  doc.setTextColor(0);
  const rightX = pageWidth - margin - 60;

  doc.setFillColor(242, 246, 255);
  doc.rect(rightX, y, 60, 8, "F");
  doc.text("SUB TOTAL", rightX + 2, y + 5);
  doc.text(`₹ ${data.subTotal.toLocaleString()}`, rightX + 58, y + 5, {
    align: "right",
  });

  y += 10;

  doc.setFillColor(107, 76, 122);
  doc.rect(rightX, y, 60, 8, "F");
  doc.setTextColor(255);
  doc.text("PAID TOTAL", rightX + 2, y + 5);
  doc.text(`₹ ${data.invoice.paidTotal.toLocaleString()}`, rightX + 58, y + 5, {
    align: "right",
  });

  doc.setTextColor(0);
  y += 10;

  doc.text("BALANCE AMOUNT", rightX + 2, y + 5);
  doc.text(`₹ ${data.balance.toLocaleString()}`, rightX + 58, y + 5, {
    align: "right",
  });

  y += 18;

  /* ================= TERMS ================= */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("TERMS AND CONDITIONS", margin, y);

  y += 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  data.terms.forEach((t) => {
    doc.text(`• ${t}`, margin + 2, y);
    y += 5;
  });

  y += 10;

  /* ================= FOOTER ================= */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(124, 58, 237);
  doc.text("THANK YOU FOR CHOOSING BOOKIE BUDDY!", margin, y);

  y += 6;
  doc.setFontSize(9);
  doc.setTextColor(0);
  doc.text(
    "We appreciate your trust and look forward to supporting your business.",
    margin,
    y
  );

  doc.save(`${data.to.name}_${data.invoice.invoiceNo}.pdf`);
};
