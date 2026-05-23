import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const NGO_NAME = process.env.NGO_NAME || 'Academic Seva';
const NGO_ADDRESS = process.env.NGO_ADDRESS || '[Registered Office Address]';
const NGO_80G_REG = process.env.NGO_80G_REG || '[80G Registration No.]';
const NGO_PAN = process.env.NGO_PAN || '[NGO PAN]';
const NGO_REG_NO = process.env.NGO_REG_NO || '[Registration No.]';
const NGO_CONTACT = process.env.NGO_CONTACT || '';

export async function generate80GCertificate(params: {
  donorName: string;
  donorPan: string;
  amount: number;
  paymentId: string;
  certificateNumber: string;
}): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const page = pdfDoc.addPage([595, 842]); // A4 portrait

  const { width, height } = page.getSize();
  const margin = 40;
  const cyan = rgb(0, 0.4, 0.6);
  const gold = rgb(0.85, 0.55, 0.08);
  const dark = rgb(0.15, 0.15, 0.15);
  const gray = rgb(0.4, 0.4, 0.4);

  // Outer decorative border
  page.drawRectangle({
    x: margin - 6,
    y: margin - 6,
    width: width - 2 * margin + 12,
    height: height - 2 * margin + 12,
    borderColor: gold,
    borderWidth: 2,
  });

  // Inner border
  page.drawRectangle({
    x: margin,
    y: margin,
    width: width - 2 * margin,
    height: height - 2 * margin,
    borderColor: cyan,
    borderWidth: 1,
  });

  // Top colored header bar
  page.drawRectangle({
    x: margin + 10,
    y: height - margin - 70,
    width: width - 2 * margin - 20,
    height: 50,
    color: cyan,
  });

  // NGO Name in header bar
  page.drawText(NGO_NAME, {
    x: margin + 20,
    y: height - margin - 52,
    size: 18,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  // Certificate title
  page.drawText('80G TAX EXEMPTION CERTIFICATE', {
    x: margin + 20,
    y: height - margin - 100,
    size: 14,
    font: fontBold,
    color: gold,
  });

  // Certificate number & date
  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  page.drawText(`Certificate No.: ${params.certificateNumber}`, {
    x: margin + 20,
    y: height - margin - 125,
    size: 9,
    font: font,
    color: gray,
  });

  page.drawText(`Date: ${today}`, {
    x: width - margin - 120,
    y: height - margin - 125,
    size: 9,
    font: font,
    color: gray,
  });

  // Horizontal separator
  page.drawLine({
    start: { x: margin + 20, y: height - margin - 135 },
    end: { x: width - margin - 20, y: height - margin - 135 },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });

  // Body text
  const bodyStartY = height - margin - 165;
  const lineHeight = 20;

  page.drawText('This is to certify that', {
    x: margin + 20,
    y: bodyStartY,
    size: 11,
    font: font,
    color: dark,
  });

  // Donor name (prominent)
  page.drawText(params.donorName.toUpperCase(), {
    x: margin + 20,
    y: bodyStartY - lineHeight,
    size: 16,
    font: fontBold,
    color: cyan,
  });

  if (params.donorPan) {
    page.drawText(`PAN: ${params.donorPan.toUpperCase()}`, {
      x: margin + 20,
      y: bodyStartY - 2 * lineHeight,
      size: 10,
      font: font,
      color: dark,
    });
  }

  page.drawText(`has made a donation of Rs.${params.amount}/- to ${NGO_NAME} on ${today}.`, {
    x: margin + 20,
    y: bodyStartY - 3 * lineHeight - 5,
    size: 11,
    font: font,
    color: dark,
  });

  page.drawText('The donation is eligible for tax exemption under Section 80G', {
    x: margin + 20,
    y: bodyStartY - 4 * lineHeight - 5,
    size: 11,
    font: font,
    color: dark,
  });

  page.drawText('of the Income Tax Act, 1961.', {
    x: margin + 20,
    y: bodyStartY - 5 * lineHeight - 5,
    size: 11,
    font: font,
    color: dark,
  });

  // Payment details box
  const detailBoxY = bodyStartY - 7 * lineHeight;
  page.drawRectangle({
    x: margin + 20,
    y: detailBoxY - 10,
    width: width - 2 * margin - 40,
    height: 90,
    color: rgb(0.97, 0.97, 0.97),
    borderColor: rgb(0.85, 0.85, 0.85),
    borderWidth: 0.5,
  });

  page.drawText('DONATION DETAILS', {
    x: margin + 30,
    y: detailBoxY + 65,
    size: 9,
    font: fontBold,
    color: cyan,
  });

  page.drawText(`Payment ID: ${params.paymentId}`, {
    x: margin + 30,
    y: detailBoxY + 45,
    size: 9,
    font: font,
    color: dark,
  });

  page.drawText(`Amount: Rs.${params.amount}/-`, {
    x: margin + 30,
    y: detailBoxY + 25,
    size: 9,
    font: font,
    color: dark,
  });

  page.drawText(`Date: ${today}`, {
    x: margin + 30,
    y: detailBoxY + 5,
    size: 9,
    font: font,
    color: dark,
  });

  // Organization details section
  const orgY = detailBoxY - 70;
  page.drawText('ORGANIZATION DETAILS', {
    x: margin + 20,
    y: orgY,
    size: 9,
    font: fontBold,
    color: cyan,
  });

  const orgDetailsLineHeight = 16;
  page.drawText(`Name: ${NGO_NAME}`, {
    x: margin + 20,
    y: orgY - orgDetailsLineHeight,
    size: 9,
    font: font,
    color: dark,
  });

  page.drawText(`Registration No.: ${NGO_REG_NO}`, {
    x: margin + 20,
    y: orgY - 2 * orgDetailsLineHeight,
    size: 9,
    font: font,
    color: dark,
  });

  page.drawText(`80G Registration No.: ${NGO_80G_REG}`, {
    x: margin + 20,
    y: orgY - 3 * orgDetailsLineHeight,
    size: 9,
    font: font,
    color: dark,
  });

  page.drawText(`PAN: ${NGO_PAN}`, {
    x: margin + 20,
    y: orgY - 4 * orgDetailsLineHeight,
    size: 9,
    font: font,
    color: dark,
  });

  page.drawText(`Address: ${NGO_ADDRESS}`, {
    x: margin + 20,
    y: orgY - 5 * orgDetailsLineHeight,
    size: 9,
    font: font,
    color: dark,
  });

  if (NGO_CONTACT) {
    page.drawText(`Contact: ${NGO_CONTACT}`, {
      x: margin + 20,
      y: orgY - 6 * orgDetailsLineHeight,
      size: 9,
      font: font,
      color: dark,
    });
  }

  // Signature area
  const sigY = orgY - 7 * orgDetailsLineHeight;
  page.drawLine({
    start: { x: width - margin - 160, y: sigY },
    end: { x: width - margin - 40, y: sigY },
    thickness: 1,
    color: dark,
  });

  page.drawText('Authorized Signatory', {
    x: width - margin - 155,
    y: sigY - 18,
    size: 10,
    font: fontBold,
    color: dark,
  });

  page.drawText(NGO_NAME, {
    x: width - margin - 155,
    y: sigY - 32,
    size: 8,
    font: font,
    color: gray,
  });

  // Footer
  page.drawText(
    'This is a computer-generated certificate and does not require a physical signature.',
    {
      x: margin + 20,
      y: margin + 10,
      size: 7,
      font: font,
      color: gray,
    }
  );

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export function generateCertificateNumber(paymentId: string): string {
  const year = new Date().getFullYear();
  const short = paymentId.slice(-5).toUpperCase();
  return `80G/AS/${year}/${short}`;
}
