// components/batches/BatchList.js
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function BatchList() {
  const [batches, setBatches] = useState([]);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: session } = useSession();

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    const res = await fetch("/api/batches");
    const data = await res.json();
    setBatches(data);
  };

  const filteredBatches = batches.filter((batch) => {
    const matchesSearch = batch.name
      .toLowerCase()
      .includes(filter.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Poultry Batches</h1>
        <Link href="/batches/new">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add New Batch
          </button>
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search batches..."
          className="border p-2 rounded flex-grow"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select
          className="border p-2 rounded"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBatches.map((batch) => (
          <div key={batch.id} className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">{batch.name}</h2>
            <p className="text-gray-600 mb-2">
              Status:{" "}
              <span
                className={`px-2 py-1 rounded text-sm ${
                  batch.status === "IN_PROGRESS"
                    ? "bg-blue-100 text-blue-800"
                    : batch.status === "SOLD"
                    ? "bg-green-100 text-green-800"
                    : batch.status === "COMPLETED"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {batch.status.replace("_", " ")}
              </span>
            </p>
            <p className="text-gray-600 mb-2">
              Start Date: {new Date(batch.startDate).toLocaleDateString()}
            </p>
            {batch.endDate && (
              <p className="text-gray-600 mb-4">
                End Date: {new Date(batch.endDate).toLocaleDateString()}
              </p>
            )}
            <Link href={`/batches/${batch.id}`}>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full">
                View Details
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}