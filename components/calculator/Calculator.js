import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from 'react';
import { formatCurrency } from "../../lib/currency";

export default function Calculator({ batch, onClose }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const totalExpenses = batch.expenses?.reduce((sum, exp) => sum + exp.total, 0) || 0;
  const totalEarnings = batch.earnings?.reduce((sum, earn) => sum + earn.total, 0) || 0;
  const totalSubtractions = batch.earnings?.reduce((sum, earn) => {
    const subtractionsTotal = earn.subtractions?.reduce((subSum, sub) => subSum + sub.amount, 0) || 0;
    return sum + subtractionsTotal;
  }, 0) || 0;
  const netEarnings = totalEarnings - totalSubtractions;
  const profitLoss = netEarnings - totalExpenses;

  const handleButtonClick = (value) => {
    setInput((prev) => prev + value);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  const handleCalculate = () => {
    try {
      // Avoid using eval in production code.
      // This is a simplified example. For a real app, use a safer method.
      const result = new Function('return ' + input)();
      setOutput(result);
    } catch (error) {
      setOutput("Error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 rounded-t-2xl bg-gray-50">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Calculator</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <div className="text-right text-gray-500 text-lg break-all">{input || "0"}</div>
            <div className="text-right text-gray-800 text-3xl font-bold break-all">{output || "0"}</div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <button onClick={() => handleButtonClick(totalExpenses)} className="bg-gray-200 hover:bg-gray-300 p-4 rounded-lg">Expenses</button>
            <button onClick={() => handleButtonClick(netEarnings)} className="bg-gray-200 hover:bg-gray-300 p-4 rounded-lg">Earnings</button>
            <button onClick={() => handleButtonClick(profitLoss)} className="bg-gray-200 hover:bg-gray-300 p-4 rounded-lg">Profit</button>
            <button onClick={handleClear} className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg">C</button>

            {['7', '8', '9', '/'].map(item => (
              <button key={item} onClick={() => handleButtonClick(item)} className="bg-gray-200 hover:bg-gray-300 p-4 rounded-lg">{item}</button>
            ))}
            {['4', '5', '6', '*'].map(item => (
              <button key={item} onClick={() => handleButtonClick(item)} className="bg-gray-200 hover:bg-gray-300 p-4 rounded-lg">{item}</button>
            ))}
            {['1', '2', '3', '-'].map(item => (
              <button key={item} onClick={() => handleButtonClick(item)} className="bg-gray-200 hover:bg-gray-300 p-4 rounded-lg">{item}</button>
            ))}
            {['0', '.', '=', '+'].map(item => (
              <button key={item} onClick={item === '=' ? handleCalculate : () => handleButtonClick(item)} className={`p-4 rounded-lg ${item === '=' ? 'bg-blue-500 hover:bg-blue-600 text-white col-span-2' : 'bg-gray-200 hover:bg-gray-300'}`}>{item}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
