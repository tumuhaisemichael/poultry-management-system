// components/expenses/ExpenseForm.js
import { useState } from "react";

export default function ExpenseForm({ batchId, onExpenseAdded }) {
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: 1,
    costPerUnit: 0,
    category: "FEED",
    isRecurring: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const total = formData.quantity * formData.costPerUnit;
    const expenseData = { ...formData, total, batchId };

    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expenseData),
    });

    if (res.ok) {
      const newExpense = await res.json();
      onExpenseAdded(newExpense);
      setFormData({
        itemName: "",
        quantity: 1,
        costPerUnit: 0,
        category: "FEED",
        isRecurring: false,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">Add New Expense</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Item Name
          </label>
          <input
            type="text"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            value={formData.itemName}
            onChange={(e) =>
              setFormData({ ...formData, itemName: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="FEED">Feed</option>
            <option value="VACCINES">Vaccines</option>
            <option value="EQUIPMENT">Equipment</option>
            <option value="MISCELLANEOUS">Miscellaneous</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            step="0.01"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: parseFloat(e.target.value) })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cost Per Unit
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            value={formData.costPerUnit}
            onChange={(e) =>
              setFormData({
                ...formData,
                costPerUnit: parseFloat(e.target.value),
              })
            }
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="recurring"
            className="mr-2"
            checked={formData.isRecurring}
            onChange={(e) =>
              setFormData({ ...formData, isRecurring: e.target.checked })
            }
          />
          <label htmlFor="recurring" className="text-sm text-gray-700">
            Recurring Expense
          </label>
        </div>
      </div>
      <div className="mt-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Expense
        </button>
      </div>
    </form>
  );
}