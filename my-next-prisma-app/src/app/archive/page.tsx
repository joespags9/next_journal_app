"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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

  // Fetch entries
  useEffect(() => {
    fetch("/api/entries")
      .then((res) => res.json())
      .then(setEntries);
  }, []);

  return (
    <main style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem" }}>
        {entries.map((entry) => (
          <Link
            key={entry.id}
            href={`/journals/${entry.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                padding: "1rem",
                border: "2px solid #ccc",
                borderRadius: "8px",
                backgroundColor: "white",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {entry.image && (
                <img
                  src={entry.image}
                  alt={entry.title || "Journal entry"}
                  style={{ width: "100%", height: "auto", marginBottom: "0.5rem", borderRadius: "4px" }}
                />
              )}
              <h3 style={{ fontSize: "1rem", margin: "0.5rem 0" }}>{entry.title}</h3>
              {entry.author && <p style={{ fontSize: "0.875rem", margin: "0.25rem 0" }}><em>By {entry.author}</em></p>}
              {entry.caption && <p style={{ fontSize: "0.875rem", margin: "0.25rem 0" }}><strong>{entry.caption}</strong></p>}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
