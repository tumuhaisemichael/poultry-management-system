import { useState, useEffect } from "react";

const PRESET_CATEGORIES = ["FEED", "VACCINES", "MEDS", "EQUIPMENT", "MISCELLANEOUS"];

export default function ExpenseForm({ batchId, onExpenseAdded, onExpenseUpdated, expenseToEdit = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [allItems, setAllItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: 1,
    costPerUnit: 0,
    category: "FEED",
    isRecurring: false,
    transactionDate: new Date().toISOString().split("T")[0],
    weekOfGiving: "",
    unit: "",
    receipt: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [receiptFileName, setReceiptFileName] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetch('/api/items')
        .then(res => res.json())
        .then(data => setAllItems(data))
        .catch(err => console.error("Failed to fetch items", err));
    }
  }, [isOpen]);

  const handleItemNameChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, itemName: value });
    if (value) {
      const filteredSuggestions = allItems.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const onSuggestHandler = (value) => {
    setFormData({ ...formData, itemName: value });
    setSuggestions([]);
  };

  const resetForm = () => {
    setFormData({
      itemName: "",
      quantity: 1,
      costPerUnit: 0,
      category: "FEED",
      isRecurring: false,
      transactionDate: new Date().toISOString().split("T")[0],
      weekOfGiving: "",
      unit: "",
      receipt: "",
    });
    setCustomCategory("");
    setReceiptFileName("");
  };

  useEffect(() => {
    if (expenseToEdit) {
      const isPreset = PRESET_CATEGORIES.includes(expenseToEdit.category);
      setFormData({
        ...formData,
        itemName: expenseToEdit.itemName,
        quantity: expenseToEdit.quantity,
        costPerUnit: expenseToEdit.costPerUnit,
        category: isPreset ? expenseToEdit.category : "OTHER",
        isRecurring: expenseToEdit.isRecurring,
        transactionDate: expenseToEdit.transactionDate ? new Date(expenseToEdit.transactionDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        weekOfGiving: expenseToEdit.weekOfGiving || "",
        unit: expenseToEdit.unit || "",
        receipt: expenseToEdit.receipt || "",
      });
      if (expenseToEdit.receipt) {
        setReceiptFileName(expenseToEdit.receipt.split('/').pop());
      }
      if (!isPreset) {
        setCustomCategory(expenseToEdit.category);
      }
      setIsOpen(true);
    } else {
      resetForm();
    }
  }, [expenseToEdit]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");
    const body = new FormData();
    body.append("file", file);
    setReceiptFileName(file.name);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body });
      if (!res.ok) {
        throw new Error('Upload failed');
      }
      const data = await res.json();
      setFormData({ ...formData, receipt: data.filePath });
    } catch (err) {
      setError("File upload failed. Please try again.");
      setReceiptFileName("");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const finalCategory = formData.category === "OTHER" ? customCategory : formData.category;
    if (!finalCategory) {
      setError("Category is required.");
      setIsLoading(false);
      return;
    }

    try {
      const total = formData.quantity * formData.costPerUnit;
      const expenseData = {
        ...formData,
        total,
        batchId,
        category: finalCategory,
        weekOfGiving: formData.weekOfGiving ? parseInt(formData.weekOfGiving, 10) : null,
      };

      let res;
      if (expenseToEdit) {
        res = await fetch(`/api/expenses/${expenseToEdit.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(expenseData),
        });
      } else {
        res = await fetch("/api/expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        resetForm();
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
    resetForm();
  };

  const getLabel = (field) => {
    switch(formData.category) {
      case 'VACCINES':
        if (field === 'itemName') return 'Vaccine Name *';
        if (field === 'quantity') return 'Amount *';
        if (field === 'costPerUnit') return 'Price per Vaccine *';
        break;
      case 'MEDS':
        if (field === 'itemName') return 'Type of Meds *';
        if (field === 'quantity') return 'Amount *';
        if (field === 'costPerUnit') return 'Cost per Unit *';
        break;
      default:
        if (field === 'itemName') return 'Item Name *';
        if (field === 'quantity') return 'Quantity *';
        if (field === 'costPerUnit') return 'Cost per Unit *';
    }
    return 'Label'; // Fallback
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
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {PRESET_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.charAt(0) + cat.slice(1).toLowerCase()}</option>)}
              <option value="OTHER">Other</option>
            </select>
          </div>

          {formData.category === "OTHER" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Custom Category *</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter custom category name"
              />
            </div>
          )}

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">{getLabel('itemName')}</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={formData.itemName}
              onChange={handleItemNameChange}
              autoComplete="off"
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto">
                {suggestions.map((suggestion, i) => (
                  <li
                    key={i}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => onSuggestHandler(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {formData.category === 'VACCINES' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Week of Giving *</label>
              <input
                type="number"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={formData.weekOfGiving}
                onChange={(e) => setFormData({ ...formData, weekOfGiving: e.target.value })}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{getLabel('quantity')}</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{getLabel('costPerUnit')}</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={formData.costPerUnit}
                onChange={(e) => setFormData({ ...formData, costPerUnit: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          {formData.category === 'MEDS' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g., bottles, grams"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Date *</label>
            <input
              type="date"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={formData.transactionDate}
              onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Receipt</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
            {receiptFileName && !uploading && <p className="text-sm text-green-600 mt-1">Uploaded: {receiptFileName}</p>}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="recurring"
              className="mr-2 h-4 w-4 text-blue-600"
              checked={formData.isRecurring}
              onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
            />
            <label htmlFor="recurring" className="text-sm text-gray-700">Recurring Expense</label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={handleClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg">Cancel</button>
            <button type="submit" disabled={isLoading || uploading} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">
              {isLoading ? "Saving..." : expenseToEdit ? "Update Expense" : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}