import { useState, useEffect } from "react";

export default function ExpenseForm({ batchId, onExpenseAdded, onExpenseUpdated, expenseToEdit = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: 1,
    costPerUnit: 0,
    category: "FEED",
    isRecurring: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill form when editing an existing expense
  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        itemName: expenseToEdit.itemName,
        quantity: expenseToEdit.quantity,
        costPerUnit: expenseToEdit.costPerUnit,
        category: expenseToEdit.category,
        isRecurring: expenseToEdit.isRecurring,
      });
      setIsOpen(true);
    }
  }, [expenseToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const total = formData.quantity * formData.costPerUnit;
      const expenseData = { ...formData, total, batchId };

      let res;
      if (expenseToEdit) {
        // Update existing expense
        res = await fetch(`/api/expenses/${expenseToEdit.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(expenseData),
        });
      } else {
        // Create new expense
        res = await fetch("/api/expenses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(expenseData),
        });
      }

      if (res.ok) {
        const expense = await res.json();
        if (expenseToEdit) {
          onExpenseUpdated(expense);
        } else {
          onExpenseAdded(expense);
        }
        setFormData({
          itemName: "",
          quantity: 1,
          costPerUnit: 0,
          category: "FEED",
          isRecurring: false,
        });
        setIsOpen(false);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save expense");
      }
    } catch (error) {
      setError("An error occurred while saving expense");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData({
      itemName: "",
      quantity: 1,
      costPerUnit: 0,
      category: "FEED",
      isRecurring: false,
    });
  };

  if (!isOpen && !expenseToEdit) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Expense
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {expenseToEdit ? "Edit Expense" : "Add New Expense"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Name *
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              placeholder="Enter item name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost Per Unit *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.costPerUnit}
                onChange={(e) => setFormData({ ...formData, costPerUnit: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="FEED">Feed</option>
              <option value="VACCINES">Vaccines</option>
              <option value="EQUIPMENT">Equipment</option>
              <option value="MISCELLANEOUS">Miscellaneous</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="recurring"
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={formData.isRecurring}
              onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
            />
            <label htmlFor="recurring" className="text-sm text-gray-700">
              Recurring Expense
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Saving..." : expenseToEdit ? "Update Expense" : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}