import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatDate } from './formatters.js';

/**
 * Generates and downloads a clean, professional PDF comparison report.
 * 
 * @param {Object} reportData - Object containing quotations, evaluatedQuotes, alignedItems, weights, insights
 */
export function exportComparisonPDF({
  quotations = [],
  evaluatedQuotes = [],
  alignedItems = [],
  weights = {},
  insights = {}
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let currentY = 40;

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 75, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('SupplierQuoteCompare', 40, 35);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Executive Procurement Trade-Off & Multi-Criteria Evaluation Report', 40, 52);

  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`, pageWidth - 40, 52, { align: 'right' });

  currentY = 95;

  // 1. Executive Summary & Weighting
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('1. Evaluation Criteria & Weighting Configuration', 40, currentY);
  currentY += 15;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const weightText = `Criteria Weights Assigned: Price: ${weights.price || 40}% | Delivery Speed: ${weights.delivery || 25}% | Warranty Coverage: ${weights.warranty || 20}% | Payment Terms: ${weights.paymentTerms || 15}%`;
  doc.text(weightText, 40, currentY);
  currentY += 15;

  // 2. Multi-Criteria Scoring Table
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('2. Multi-Criteria Vendor Scorecard', 40, currentY);
  currentY += 10;

  const scoreTableHeaders = [
    ['Rank', 'Supplier & Quote #', 'Total Bid', 'Lead Time', 'Warranty', 'Terms', 'Price', 'Speed', 'War.', 'Terms', 'Overall Score']
  ];

  const scoreTableRows = evaluatedQuotes.map((eq, idx) => [
    `#${idx + 1}`,
    `${eq.supplierName || 'Unknown'}\n(${eq.quotationNumber || eq.id || 'N/A'})`,
    formatCurrency(eq.grandTotal),
    `${eq.leadTimeDays || 7}d`,
    `${eq.warrantyMonths || 12}m`,
    eq.paymentTerms || 'Net 30',
    `${eq.scores?.price ?? 0}`,
    `${eq.scores?.delivery ?? 0}`,
    `${eq.scores?.warranty ?? 0}`,
    `${eq.scores?.paymentTerms ?? 0}`,
    `${eq.scores?.composite ?? 0} / 100`
  ]);

  autoTable(doc, {
    startY: currentY,
    head: scoreTableHeaders,
    body: scoreTableRows,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 5, textColor: [30, 41, 59] },
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 32, fontStyle: 'bold', halign: 'center' },
      1: { cellWidth: 105 },
      2: { cellWidth: 65, halign: 'right', fontStyle: 'bold' },
      10: { cellWidth: 65, halign: 'center', fontStyle: 'bold', fillColor: [241, 245, 249] }
    },
    margin: { left: 40, right: 40 }
  });

  currentY = doc.lastAutoTable.finalY + 20;

  // 3. Product Line Items & Normalised Unit Prices
  if (alignedItems && alignedItems.length > 0) {
    // Check if space is tight, add page
    if (currentY > pageHeight - 160) {
      doc.addPage();
      currentY = 40;
    }

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('3. Product Line Items & Unit Price Normalisation', 40, currentY);
    currentY += 10;

    const itemHeaders = [
      ['Product Name', 'Supplier', 'Quoted Pack Size', 'Quoted Price', 'Normalised Price', 'Line Total']
    ];

    const itemRows = [];
    alignedItems.forEach(prod => {
      prod.entries.forEach(entry => {
        const norm = entry.calculatedNormalisation;
        itemRows.push([
          prod.productName,
          entry.supplierName,
          `${entry.item.packageSize} ${entry.item.measurementUnit}`,
          formatCurrency(entry.item.unitPrice),
          norm?.success ? `${formatCurrency(norm.normalizedPrice)} / ${norm.baseUnit}` : 'N/A',
          formatCurrency(entry.item.lineTotal)
        ]);
      });
    });

    autoTable(doc, {
      startY: currentY,
      head: itemHeaders,
      body: itemRows,
      theme: 'striped',
      styles: { fontSize: 8, cellPadding: 4.5, textColor: [30, 41, 59] },
      headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontStyle: 'bold' },
      margin: { left: 40, right: 40 }
    });

    currentY = doc.lastAutoTable.finalY + 20;
  }

  // 4. Commercial Parameters & Conditions
  if (currentY > pageHeight - 150) {
    doc.addPage();
    currentY = 40;
  }

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('4. Commercial Conditions & Financial Breakdown', 40, currentY);
  currentY += 10;

  const commercialHeaders = [
    ['Commercial Parameter', ...quotations.map(q => q.supplierName)]
  ];

  const commercialRows = [
    ['Products Subtotal', ...quotations.map(q => formatCurrency(q.summary?.productSubtotal || q.summary?.grossSubtotal || 0))],
    ['Freight & Delivery', ...quotations.map(q => formatCurrency(q.commercialTerms?.deliveryCharges || 0))],
    ['Additional / Handling', ...quotations.map(q => formatCurrency(q.commercialTerms?.additionalCharges || 0))],
    ['Taxes & Duties', ...quotations.map(q => formatCurrency(q.summary?.totalTax || 0))],
    ['Grand Commercial Total', ...quotations.map(q => formatCurrency(q.summary?.grandTotal || q.totalAmount || 0))],
    ['Delivery Lead Time', ...quotations.map(q => `${q.commercialTerms?.leadTimeDays || 7} Business Days`)],
    ['Warranty Period', ...quotations.map(q => `${q.commercialTerms?.warrantyMonths || 12} Months`)],
    ['Payment Terms', ...quotations.map(q => q.commercialTerms?.paymentTerms || 'Net 30')]
  ];

  autoTable(doc, {
    startY: currentY,
    head: commercialHeaders,
    body: commercialRows,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 4.5, textColor: [30, 41, 59] },
    headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontStyle: 'bold' },
    margin: { left: 40, right: 40 }
  });

  currentY = doc.lastAutoTable.finalY + 20;

  // 5. Advantages & Trade-Off Analysis
  if (currentY > pageHeight - 160) {
    doc.addPage();
    currentY = 40;
  }

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('5. Supplier Trade-Offs (Strengths & Caveats)', 40, currentY);
  currentY += 15;

  evaluatedQuotes.forEach((eq) => {
    if (currentY > pageHeight - 80) {
      doc.addPage();
      currentY = 40;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(`• ${eq.supplierName || 'Supplier'} (${eq.quotationNumber || eq.id || 'N/A'}) — Overall Score: ${eq.scores?.composite ?? 0}/100`, 45, currentY);
    currentY += 12;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    if (eq.pros && eq.pros.length > 0) {
      doc.setTextColor(22, 101, 52); // emerald-800
      doc.text(`  Strengths: ${eq.pros.join('; ')}`, 55, currentY);
      currentY += 10;
    }

    if (eq.cons && eq.cons.length > 0) {
      doc.setTextColor(153, 27, 27); // rose-800
      doc.text(`  Caveats: ${eq.cons.join('; ')}`, 55, currentY);
      currentY += 12;
    }
  });

  // Footer on each page
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `SupplierQuoteCompare | Confidential Procurement Analysis | Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 20,
      { align: 'center' }
    );
  }

  // Trigger download
  const dateStr = new Date().toISOString().slice(0, 10);
  doc.save(`SupplierQuoteCompare_Evaluation_Report_${dateStr}.pdf`);
}
