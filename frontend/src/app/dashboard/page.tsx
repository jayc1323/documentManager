"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const res = await fetch("/dashboard", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch documents");
        const data = await res.json();
        setDocuments(data.documents || []);
      } catch (err: any) {
        setError(err.message || "Error fetching documents");
      }
      setLoading(false);
    }
    fetchDocuments();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-blue-700">Dashboard</h1>
      {loading ? (
        <p>Loading documents...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul className="bg-white shadow-md rounded-lg p-8 w-full max-w-md flex flex-col gap-4">
          {documents.length === 0 ? (
            <li className="text-gray-500">No documents found.</li>
          ) : (
            documents.map((doc, idx) => (
              <li key={doc.id || idx} className="border-b py-2">
                {doc.name || JSON.stringify(doc)}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
