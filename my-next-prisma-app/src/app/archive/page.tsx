"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Entry = {
  id: number;
  title: string | null;
  author: string | null;
  date: string | null;
  caption: string | null;
  image: string | null;
  text: string | null;
};

export default function ArchivePage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch entries
  useEffect(() => {
    fetch("/api/entries")
      .then((res) => res.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault(); // Prevent navigation to detail page
    e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        const res = await fetch(`/api/entries/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          // Remove the entry from the state
          setEntries(entries.filter(entry => entry.id !== id));
        } else {
          alert("Failed to delete entry");
        }
      } catch (error) {
        console.error("Error deleting entry:", error);
        alert("Error deleting entry");
      }
    }
  };

  const handleEdit = (e: React.MouseEvent, id: number) => {
    e.preventDefault(); // Prevent navigation to detail page
    e.stopPropagation();
    router.push(`/edit-entry/${id}`);
  };

  if (loading) {
    return (
      <main className="p-8 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-5 gap-4">
        {entries.map((entry) => (
          <div key={entry.id} className="relative group h-full">
            <Link
              href={`/journals/${entry.id}`}
              className="no-underline text-inherit block h-full"
            >
              <div className="p-4 border-2 border-gray-300 rounded-lg bg-white cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md h-full flex flex-col">
                {entry.image && (
                  <img
                    src={entry.image}
                    alt={entry.title || "Journal entry"}
                    className="w-full h-48 object-cover mb-2 rounded"
                  />
                )}
                <h3 className="text-base my-2">{entry.title}</h3>
                {entry.author && <p className="text-sm my-1"><em>By {entry.author}</em></p>}
                {entry.caption && <p className="text-sm my-1"><strong>{entry.caption}</strong></p>}
              </div>
            </Link>

            {/* Edit and Delete buttons */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={(e) => handleEdit(e, entry.id)}
                className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                title="Edit"
              >
                Edit
              </button>
              <button
                onClick={(e) => handleDelete(e, entry.id)}
                className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                title="Delete"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
