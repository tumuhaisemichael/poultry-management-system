import { XMarkIcon } from "@heroicons/react/24/outline";

export default function DetailsOverlay({ item, onClose, type }) {
  if (!item) return null;

  const isExpense = type === 'expense';
  const colorClass = isExpense ? 'text-red-600' : 'text-green-600';
  const bgColorClass = isExpense ? 'bg-red-50' : 'bg-green-50';

  const fields = [
    { label: 'Item Name', value: item.itemName },
    { label: 'Quantity', value: item.quantity },
    { label: isExpense ? 'Cost Per Unit' : 'Amount Per Unit', value: `$${(isExpense ? item.costPerUnit : item.amountPerUnit).toFixed(2)}` },
    { label: 'Total', value: `$${item.total.toFixed(2)}`, isTotal: true },
    { label: 'Category', value: item.category },
    { label: 'Date', value: new Date(item.createdAt).toLocaleDateString() },
  ];

  if (isExpense) {
    fields.push({ label: 'Recurring', value: item.isRecurring ? 'Yes' : 'No' });
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className={`p-6 rounded-t-2xl ${bgColorClass}`}>
          <div className="flex justify-between items-center">
            <h2 className={`text-2xl font-bold ${colorClass}`}>
              {isExpense ? 'Expense Details' : 'Earning Details'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {fields.map(({ label, value, isTotal }) => (
            <div key={label} className={`flex justify-between items-center py-3 ${isTotal ? 'border-t border-b border-gray-200 font-bold' : 'border-b border-gray-100'}`}>
              <span className="text-gray-600">{label}</span>
              <span className={`text-right ${isTotal ? colorClass : 'text-gray-900'}`}>{value}</span>
            </div>
          ))}

          {item.attachment && (
            <div className="pt-4">
              <h3 className="text-gray-600 mb-2 font-semibold">Attachment</h3>
              <a
                href={item.attachment}
                download={item.attachmentName}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                {item.attachmentName || 'Download File'}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
