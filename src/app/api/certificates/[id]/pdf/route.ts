import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { formatDhakaDateOnly } from '@/lib/timezone';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const cert = await db.certificate.findUnique({
    where: { id },
    include: {
      template: true,
      user: { select: { name: true } },
    },
  });

  if (!cert || cert.isRevoked) {
    return NextResponse.json({ error: 'Certificate not found or revoked' }, { status: 404 });
  }

  // Generate PDF document in A4 Landscape (842 x 595)
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]);
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Colors
  const tealColor = rgb(12 / 255, 74 / 255, 78 / 255); // #0c4a4e
  const pinkColor = rgb(236 / 255, 72 / 255, 153 / 255); // #ec4899
  const slateDark = rgb(15 / 255, 23 / 255, 42 / 255);
  const slateMuted = rgb(100 / 255, 116 / 255, 139 / 255);

  // Decorative Outer Borders
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: tealColor,
    borderWidth: 3,
  });

  page.drawRectangle({
    x: 28,
    y: 28,
    width: width - 56,
    height: height - 56,
    borderColor: pinkColor,
    borderWidth: 1.5,
  });

  // Top Brand Header
  const brandTitle = "RIFFAT'S CLASSROOM";
  const brandWidth = fontBold.widthOfTextAtSize(brandTitle, 22);
  page.drawText(brandTitle, {
    x: (width - brandWidth) / 2,
    y: height - 80,
    size: 22,
    font: fontBold,
    color: tealColor,
  });

  const tagline = "Learn English. Build Confidence. Shine Brighter.";
  const taglineWidth = fontRegular.widthOfTextAtSize(tagline, 11);
  page.drawText(tagline, {
    x: (width - taglineWidth) / 2,
    y: height - 98,
    size: 11,
    font: fontRegular,
    color: slateMuted,
  });

  // Main Award Title
  const awardTitle = "CERTIFICATE OF ACHIEVEMENT";
  const awardWidth = fontBold.widthOfTextAtSize(awardTitle, 20);
  page.drawText(awardTitle, {
    x: (width - awardWidth) / 2,
    y: height - 150,
    size: 20,
    font: fontBold,
    color: pinkColor,
  });

  const presentedTo = "THIS IS PROUDLY PRESENTED TO";
  const presentedWidth = fontRegular.widthOfTextAtSize(presentedTo, 10);
  page.drawText(presentedTo, {
    x: (width - presentedWidth) / 2,
    y: height - 190,
    size: 10,
    font: fontRegular,
    color: slateMuted,
  });

  // Student Name
  const studentName = cert.studentName.toUpperCase();
  const nameWidth = fontBold.widthOfTextAtSize(studentName, 30);
  page.drawText(studentName, {
    x: (width - nameWidth) / 2,
    y: height - 235,
    size: 30,
    font: fontBold,
    color: slateDark,
  });

  // Divider line under name
  page.drawLine({
    start: { x: (width - 400) / 2, y: height - 245 },
    end: { x: (width + 400) / 2, y: height - 245 },
    thickness: 1,
    color: pinkColor,
  });

  // Accomplishment text
  const completionText = `for successfully completing all coursework, practice exercises, and assessments in`;
  const compWidth = fontRegular.widthOfTextAtSize(completionText, 12);
  page.drawText(completionText, {
    x: (width - compWidth) / 2,
    y: height - 280,
    size: 12,
    font: fontRegular,
    color: slateDark,
  });

  // Course Title
  const courseTitle = `"${cert.courseTitle}"`;
  const courseWidth = fontBold.widthOfTextAtSize(courseTitle, 18);
  page.drawText(courseTitle, {
    x: (width - courseWidth) / 2,
    y: height - 315,
    size: 18,
    font: fontBold,
    color: tealColor,
  });

  // Signatory & Date Footer
  const dateStr = `Issued on: ${formatDhakaDateOnly(cert.issuedAt)}`;
  page.drawText(dateStr, {
    x: 80,
    y: 95,
    size: 10,
    font: fontRegular,
    color: slateDark,
  });

  const certNumStr = `Certificate ID: ${cert.certificateNumber}`;
  page.drawText(certNumStr, {
    x: 80,
    y: 80,
    size: 10,
    font: fontBold,
    color: tealColor,
  });

  const verifyStr = `Verify: /verify/${cert.verificationCode}`;
  page.drawText(verifyStr, {
    x: 80,
    y: 65,
    size: 9,
    font: fontOblique,
    color: slateMuted,
  });

  // Instructor Signature Area (Right side)
  const signatoryName = cert.template?.signatoryName || "Riffat Sultana";
  const signatoryTitle = cert.template?.signatoryTitle || "Founder & Lead English Instructor";

  page.drawLine({
    start: { x: width - 300, y: 110 },
    end: { x: width - 80, y: 110 },
    thickness: 1.5,
    color: tealColor,
  });

  page.drawText(signatoryName, {
    x: width - 290,
    y: 92,
    size: 12,
    font: fontBold,
    color: slateDark,
  });

  page.drawText(signatoryTitle, {
    x: width - 290,
    y: 77,
    size: 9,
    font: fontRegular,
    color: slateMuted,
  });

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="Certificate-${cert.certificateNumber}.pdf"`,
    },
  });
}
