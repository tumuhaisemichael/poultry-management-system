import { useState, useEffect } from "react";

const PRESET_CATEGORIES = ["CHICKEN_SALES", "EGG_SALES", "BY_PRODUCTS"];

export default function EarningForm({ batchId, onEarningAdded, onEarningUpdated, earningToEdit = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [allItems, setAllItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: 1,
    amountPerUnit: 0,
    category: "CHICKEN_SALES",
    transactionDate: new Date().toISOString().split("T")[0],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
      amountPerUnit: 0,
      category: "CHICKEN_SALES",
      transactionDate: new Date().toISOString().split("T")[0],
    });
    setCustomCategory("");
  };

  useEffect(() => {
    if (earningToEdit) {
      const isPreset = PRESET_CATEGORIES.includes(earningToEdit.category);
      setFormData({
        itemName: earningToEdit.itemName,
        quantity: earningToEdit.quantity,
        amountPerUnit: earningToEdit.amountPerUnit,
        category: isPreset ? earningToEdit.category : "OTHER",
        transactionDate: earningToEdit.transactionDate ? new Date(earningToEdit.transactionDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      });
      if (!isPreset) {
        setCustomCategory(earningToEdit.category);
      }
      setIsOpen(true);
    } else {
      resetForm();
    }
  }, [earningToEdit]);

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
      const total = formData.quantity * formData.amountPerUnit;
      const earningData = {
        ...formData,
        total,
        batchId,
        category: finalCategory
      };

      let res;
      if (earningToEdit) {
        res = await fetch(`/api/earnings/${earningToEdit.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(earningData),
        });
      } else {
        res = await fetch("/api/earnings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(earningData),
        });
      }

      if (res.ok) {
        const earning = await res.json();
        if (earningToEdit) {
          onEarningUpdated(earning);
        } else {
          onEarningAdded(earning);
        }
        resetForm();
        setIsOpen(false);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save earning");
      }
    } catch (error) {
      setError("An error occurred while saving earning");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  if (!isOpen && !earningToEdit) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Earning
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {earningToEdit ? "Edit Earning" : "Add New Earning"}
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
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
              {PRESET_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>)}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={formData.itemName}
              onChange={handleItemNameChange}
              autoComplete="off"
              placeholder="Enter item name"
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount Per Unit *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={formData.amountPerUnit}
                onChange={(e) => setFormData({ ...formData, amountPerUnit: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

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

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={handleClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg">Cancel</button>
            <button type="submit" disabled={isLoading} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">
              {isLoading ? "Saving..." : earningToEdit ? "Update Earning" : "Add Earning"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}