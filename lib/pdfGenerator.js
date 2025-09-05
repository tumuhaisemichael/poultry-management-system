import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from './currency';

export const generateExpensesPDF = (expenses, batchName) => {
  const doc = new jsPDF();

  doc.text(`Expense Report for Batch: ${batchName}`, 14, 16);
  doc.setFontSize(12);

  const tableColumn = ["Date", "Item", "Category", "Quantity", "Cost/Unit", "Total"];
  const tableRows = [];

  expenses.forEach(expense => {
    const expenseData = [
      expense.transactionDate ? new Date(expense.transactionDate).toLocaleDateString() : 'N/A',
      expense.itemName,
      expense.category,
      expense.quantity,
      formatCurrency(expense.costPerUnit),
      formatCurrency(expense.total),
    ];
    tableRows.push(expenseData);
  });

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.total, 0);
  tableRows.push(["", "", "", "", "Total Expenses:", formatCurrency(totalExpenses)]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
  });

  doc.save(`expenses_${batchName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateEarningsPDF = (earnings, batchName) => {
  const doc = new jsPDF();

  doc.text(`Earning Report for Batch: ${batchName}`, 14, 16);
  doc.setFontSize(12);

  const tableColumn = ["Date", "Item", "Category", "Quantity", "Amount/Unit", "Total"];
  const tableRows = [];

  earnings.forEach(earning => {
    const earningData = [
      earning.transactionDate ? new Date(earning.transactionDate).toLocaleDateString() : 'N/A',
      earning.itemName,
      earning.category,
      earning.quantity,
      formatCurrency(earning.amountPerUnit),
      formatCurrency(earning.total),
    ];
    tableRows.push(earningData);
  });

  const totalEarnings = earnings.reduce((acc, curr) => acc + curr.total, 0);
  tableRows.push(["", "", "", "", "Total Earnings:", formatCurrency(totalEarnings)]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
  });

  doc.save(`earnings_${batchName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateAnalyticsPDF = (batch) => {
  const doc = new jsPDF();
  const { name, expenses, earnings } = batch;

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.total, 0);
  const totalEarnings = earnings.reduce((sum, earn) => sum + earn.total, 0);
  const profitLoss = totalEarnings - totalExpenses;
  const roi = totalExpenses > 0 ? ((profitLoss / totalExpenses) * 100).toFixed(2) + "%" : "N/A";

  doc.text(`Analytics Report for Batch: ${name}`, 14, 16);
  doc.setFontSize(12);

  const summaryData = [
    ["Total Expenses", formatCurrency(totalExpenses)],
    ["Total Earnings", formatCurrency(totalEarnings)],
    ["Profit/Loss", formatCurrency(profitLoss)],
    ["Return on Investment (ROI)", roi],
  ];

  autoTable(doc, {
    head: [["Metric", "Value"]],
    body: summaryData,
    startY: 20,
  });

  if (expenses.length > 0) {
    doc.addPage();
    doc.text(`Expense Details for ${name}`, 14, 16);
    const expenseColumns = ["Date", "Item", "Category", "Total"];
    const expenseRows = expenses.map(e => [
      e.transactionDate ? new Date(e.transactionDate).toLocaleDateString() : 'N/A',
      e.itemName,
      e.category,
      formatCurrency(e.total)
    ]);
    autoTable(doc, { head: [expenseColumns], body: expenseRows, startY: 20 });
  }

  if (earnings.length > 0) {
    doc.addPage();
    doc.text(`Earning Details for ${name}`, 14, 16);
    const earningColumns = ["Date", "Item", "Category", "Total"];
    const earningRows = earnings.map(e => [
      e.transactionDate ? new Date(e.transactionDate).toLocaleDateString() : 'N/A',
      e.itemName,
      e.category,
      formatCurrency(e.total)
    ]);
    autoTable(doc, { head: [earningColumns], body: earningRows, startY: 20 });
  }

  doc.save(`analytics_${name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
}

export const generateDashboardPDF = (batchData, timeRange) => {
  const doc = new jsPDF();

  doc.text(`Dashboard Report (${timeRange})`, 14, 16);
  doc.setFontSize(12);

  const totalExpenses = batchData.reduce((sum, batch) => sum + batch.totalExpenses, 0);
  const totalEarnings = batchData.reduce((sum, batch) => sum + batch.totalEarnings, 0);
  const profitLoss = totalEarnings - totalExpenses;

  const summaryData = [
    ["Total Expenses", formatCurrency(totalExpenses)],
    ["Total Earnings", formatCurrency(totalEarnings)],
    ["Total Profit/Loss", formatCurrency(profitLoss)],
  ];

  autoTable(doc, {
    head: [["Overall Metric", "Value"]],
    body: summaryData,
    startY: 20,
  });

  const tableColumn = ["Batch", "Expenses", "Earnings", "Profit/Loss"];
  const tableRows = batchData.map(batch => [
    batch.name,
    formatCurrency(batch.totalExpenses),
    formatCurrency(batch.totalEarnings),
    formatCurrency(batch.totalEarnings - batch.totalExpenses),
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: doc.autoTable.previous.finalY + 10,
  });

  doc.save(`dashboard_report_${new Date().toISOString().split('T')[0]}.pdf`);
};
