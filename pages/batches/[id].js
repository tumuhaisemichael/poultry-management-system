import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import ExpenseForm from "../../components/expenses/ExpenseForm";
import EarningForm from "../../components/earnings/EarningForm";

export default function BatchDetail() {
  const [batch, setBatch] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (session && id) {
      fetchBatch();
    }
  }, [session, id]);

  const fetchBatch = async () => {
    try {
      const res = await fetch(`/api/batches/${id}`);
      const data = await res.json();
      setBatch(data);
    } catch (error) {
      console.error("Error fetching batch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpenseAdded = (newExpense) => {
    setBatch(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense]
    }));
    fetchBatch(); // Refresh data to get updated totals
  };

  const handleEarningAdded = (newEarning) => {
    setBatch(prev => ({
      ...prev,
      earnings: [...prev.earnings, newEarning]
    }));
    fetchBatch(); // Refresh data to get updated totals
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">Please sign in to view batch details</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-600">Batch not found</div>
      </div>
    );
  }

  const totalExpenses = batch.expenses?.reduce((sum, exp) => sum + exp.total, 0) || 0;
  const totalEarnings = batch.earnings?.reduce((sum, earn) => sum + earn.total, 0) || 0;
  const profitLoss = totalEarnings - totalExpenses;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/batches" className="inline-flex items-center text-blue-500 hover:text-blue-700">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Batches
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{batch.name}</h1>
              <p className="text-gray-600">
                Started: {new Date(batch.startDate).toLocaleDateString()}
                {batch.endDate && ` • Ended: ${new Date(batch.endDate).toLocaleDateString()}`}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              batch.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" :
              batch.status === "SOLD" ? "bg-green-100 text-green-800" :
              batch.status === "COMPLETED" ? "bg-gray-100 text-gray-800" :
              "bg-red-100 text-red-800"
            }`}>
              {batch.status.replace("_", " ")}
            </span>
          </div>

          {batch.notes && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Notes</h3>
              <p className="text-gray-600">{batch.notes}</p>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
            <p className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
            <p className="text-2xl font-bold text-green-600">${totalEarnings.toFixed(2)}</p>
          </div>
          <div className={`bg-white p-4 rounded-lg shadow-sm ${
            profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <h3 className="text-sm font-medium text-gray-500">Profit/Loss</h3>
            <p className="text-2xl font-bold">${profitLoss.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {["overview", "expenses", "earnings", "analytics"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4">Batch Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Recent Expenses</h3>
                  {batch.expenses?.length > 0 ? (
                    <div className="space-y-2">
                      {batch.expenses.slice(0, 5).map((expense) => (
                        <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span>{expense.itemName}</span>
                          <span className="text-red-600">${expense.total.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No expenses recorded</p>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Recent Earnings</h3>
                  {batch.earnings?.length > 0 ? (
                    <div className="space-y-2">
                      {batch.earnings.slice(0, 5).map((earning) => (
                        <div key={earning.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span>{earning.itemName}</span>
                          <span className="text-green-600">${earning.total.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No earnings recorded</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "expenses" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-800">Expenses</h2>
                <ExpenseForm batchId={batch.id} onExpenseAdded={handleExpenseAdded} />
              </div>
              
              {batch.expenses?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cost/Unit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {batch.expenses.map((expense) => (
                        <tr key={expense.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {expense.itemName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {expense.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${expense.costPerUnit.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                            ${expense.total.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {expense.category}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No expenses recorded yet</p>
              )}
            </div>
          )}

          {activeTab === "earnings" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-800">Earnings</h2>
                <EarningForm batchId={batch.id} onEarningAdded={handleEarningAdded} />
              </div>
              
              {batch.earnings?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount/Unit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {batch.earnings.map((earning) => (
                        <tr key={earning.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {earning.itemName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {earning.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${earning.amountPerUnit.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                            ${earning.total.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {earning.category}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No earnings recorded yet</p>
              )}
            </div>
          )}

          {activeTab === "analytics" && (
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4">Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Financial Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Expenses:</span>
                      <span className="text-red-600">${totalExpenses.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Earnings:</span>
                      <span className="text-green-600">${totalEarnings.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">Net Profit/Loss:</span>
                      <span className={profitLoss >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                        ${profitLoss.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Profitability</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>ROI:</span>
                      <span className={profitLoss >= 0 ? "text-green-600" : "text-red-600"}>
                        {totalExpenses > 0 ? ((profitLoss / totalExpenses) * 100).toFixed(2) + "%" : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expense to Revenue Ratio:</span>
                      <span>
                        {totalEarnings > 0 ? (totalExpenses / totalEarnings).toFixed(2) : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}