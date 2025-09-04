import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function BatchList() {
  const [batches, setBatches] = useState([]);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      fetchBatches();
    }
  }, [session]);

  const fetchBatches = async () => {
    try {
      const res = await fetch("/api/batches");
      const data = await res.json();
      setBatches(data);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  const filteredBatches = batches.filter((batch) => {
    const matchesSearch = batch.name.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = statusFilter === "all" || batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">Please sign in to view batches</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Poultry Batches</h1>
        <Link href="/batches/new">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            Add New Batch
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search batches..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="SOLD">Sold</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBatches.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No batches found. Create your first batch to get started.</p>
          </div>
        ) : (
          filteredBatches.map((batch) => (
            <div key={batch.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">{batch.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    batch.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" :
                    batch.status === "SOLD" ? "bg-green-100 text-green-800" :
                    batch.status === "COMPLETED" ? "bg-gray-100 text-gray-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {batch.status.replace("_", " ")}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-gray-600">
                    <span className="font-medium">Start:</span> {new Date(batch.startDate).toLocaleDateString()}
                  </p>
                  {batch.endDate && (
                    <p className="text-gray-600">
                      <span className="font-medium">End:</span> {new Date(batch.endDate).toLocaleDateString()}
                    </p>
                  )}
                  {batch.notes && (
                    <p className="text-gray-600 truncate">
                      <span className="font-medium">Notes:</span> {batch.notes}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-500">
                    Expenses: <span className="font-medium text-red-600">${batch.expenses?.reduce((sum, exp) => sum + exp.total, 0) || 0}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Earnings: <span className="font-medium text-green-600">${batch.earnings?.reduce((sum, earn) => sum + earn.total, 0) || 0}</span>
                  </div>
                </div>

                <Link href={`/batches/${batch.id}`}>
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}