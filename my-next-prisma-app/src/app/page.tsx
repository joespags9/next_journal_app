"use client";

import { useState, useEffect } from "react";

type Entry = {
  id: number;
  title: string | null;
  author: string | null;
  date: string | null;
  caption: string | null;
  image: string | null;
  text: string | null;
};

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);

  // Fetch entries
  useEffect(() => {
    fetch("/api/entries")
      .then((res) => res.json())
      .then(setEntries);
  }, []);

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>My Journal</h1>

      <div>
        {entries.map((entry) => (
          <div
            key={entry.id}
            style={{
              marginBottom: "2rem",
              padding: "1rem",
              border: "2px solid #333",
              borderRadius: "8px",
              backgroundColor: "white",
            }}
          >
            <h2>{entry.title}</h2>
            {entry.author && <p><em>By {entry.author}</em></p>}
            {entry.date && (
              <p>
                <small>{new Date(entry.date).toLocaleDateString()}</small>
              </p>
            )}
            {entry.caption && <p><strong>{entry.caption}</strong></p>}
            {entry.image && (
              <img
                src={entry.image}
                alt={entry.title || "Journal entry"}
                style={{ maxWidth: "100%", height: "auto", marginBottom: "1rem" }}
              />
            )}
            {entry.text && <p>{entry.text}</p>}
          </div>
        ))}
      </div>
    </main>
  );
}
