import { useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from '../../lib/currency';

export default function DownloadButton({ batchData }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDownload = (type) => {
    if (!batchData) return;

    const doc = new jsPDF();
    const { name, earnings, expenses, startDate, endDate } = batchData;
    const safeName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    const addHeader = (title) => {
      doc.setFontSize(18);
      doc.text(title, 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Batch: ${name}`, 14, 30);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 30);
    };

    const addSummary = (yOffset) => {
      const totalExpenses = expenses.reduce((sum, exp) => sum + exp.total, 0);
      const totalEarnings = earnings.reduce((sum, earn) => {
        const subtractionsTotal = earn.subtractions?.reduce((subSum, sub) => subSum + sub.amount, 0) || 0;
        return sum + (earn.total - subtractionsTotal);
      }, 0);
      const profitLoss = totalEarnings - totalExpenses;

      doc.setFontSize(14);
      doc.text('Financial Summary', 14, yOffset);
      
      autoTable(doc, {
        startY: yOffset + 5,
        head: [['Metric', 'Amount']],
        body: [
          ['Total Earnings', formatCurrency(totalEarnings)],
          ['Total Expenses', formatCurrency(totalExpenses)],
          ['Profit/Loss', formatCurrency(profitLoss)],
        ],
        theme: 'striped',
        headStyles: { fillColor: [22, 160, 133] },
      });
      
      // Access finalY from doc.lastAutoTable or doc.autoTable.previous
      return (doc.lastAutoTable?.finalY || doc.autoTable?.previous?.finalY || yOffset + 50) + 10;
    };

    switch (type) {
      case 'earnings':
        addHeader('Earnings Report');
        autoTable(doc, {
          startY: 40,
          head: [['Item', 'Category', 'Total', 'Net Amount']],
          body: earnings.map(e => {
            const subtractionsTotal = e.subtractions?.reduce((subSum, sub) => subSum + sub.amount, 0) || 0;
            const netAmount = e.total - subtractionsTotal;
            return [e.itemName, e.category, formatCurrency(e.total), formatCurrency(netAmount)];
          }),
        });
        doc.save(`${safeName}_earnings.pdf`);
        break;

      case 'expenses':
        addHeader('Expenses Report');
        autoTable(doc, {
          startY: 40,
          head: [['Item', 'Category', 'Quantity', 'Cost/Unit', 'Total']],
          body: expenses.map(e => [e.itemName, e.category, e.quantity, formatCurrency(e.costPerUnit), formatCurrency(e.total)]),
        });
        doc.save(`${safeName}_expenses.pdf`);
        break;

      case 'profit':
        addHeader('Profit/Loss Report');
        addSummary(40);
        doc.save(`${safeName}_profit_loss.pdf`);
        break;

      case 'all':
        addHeader('Complete Batch Report');
        let yOffset = addSummary(40);

        doc.setFontSize(14);
        doc.text('Earnings Details', 14, yOffset);
        autoTable(doc, {
          startY: yOffset + 5,
          head: [['Item', 'Category', 'Total', 'Net Amount']],
          body: earnings.map(e => {
            const subtractionsTotal = e.subtractions?.reduce((subSum, sub) => subSum + sub.amount, 0) || 0;
            const netAmount = e.total - subtractionsTotal;
            return [e.itemName, e.category, formatCurrency(e.total), formatCurrency(netAmount)];
          }),
        });
        
        // Get the finalY position after the earnings table
        yOffset = (doc.lastAutoTable?.finalY || doc.autoTable?.previous?.finalY || yOffset + 50) + 10;

        doc.setFontSize(14);
        doc.text('Expenses Details', 14, yOffset);
        autoTable(doc, {
          startY: yOffset + 5,
          head: [['Item', 'Category', 'Quantity', 'Cost/Unit', 'Total']],
          body: expenses.map(e => [e.itemName, e.category, e.quantity, formatCurrency(e.costPerUnit), formatCurrency(e.total)]),
        });
        doc.save(`${safeName}_full_report.pdf`);
        break;
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
          Download
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <a href="#" onClick={(e) => { e.preventDefault(); handleDownload('earnings'); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Download Earnings (PDF)
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleDownload('expenses'); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Download Expenses (PDF)
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleDownload('profit'); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Download Profit/Loss (PDF)
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleDownload('all'); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Download Full Report (PDF)
            </a>
          </div>
        </div>
      )}
    </div>
  );
}