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

export default function Home() {
  const [mostRecentEntry, setMostRecentEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Fetch the most recent entry
  useEffect(() => {
    setMounted(true);

    const fetchEntries = () => {
      setLoading(true);
      fetch("/api/entries", { cache: 'no-store' })
        .then((res) => res.json())
        .then((entries: Entry[]) => {
          if (entries.length > 0) {
            // Entries are already sorted by date descending, so first one is most recent
            setMostRecentEntry(entries[0]);
          } else {
            setMostRecentEntry(null);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching entries:", error);
          setLoading(false);
        });
    };

    fetchEntries();

    // Re-fetch when page becomes visible (e.g., navigating back)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchEntries();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Show loading state until mounted and data is fetched
  if (!mounted || loading) {
    return (
      <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <h1>Loading...</h1>
      </main>
    );
  }

  if (!mostRecentEntry) {
    return (
      <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <h1>No journal entries yet</h1>
        <p style={{ marginTop: "1rem" }}>
          <Link href="/new-entry" style={{ color: "#0070f3", textDecoration: "underline" }}>
            Create your first entry
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "0.5rem", color: "#333" }}>
        Most Recent Article
      </h1>
      <p style={{ textAlign: "center", fontSize: "1rem", color: "#666", marginBottom: "2rem" }}>
        Click the card below to read the full article
      </p>

      <Link
        href={`/journals/${mostRecentEntry.id}`}
        style={{ textDecoration: "none", color: "inherit", display: "block" }}
      >
        <div
          style={{
            border: "2px solid #e0e0e0",
            borderRadius: "12px",
            padding: "2rem",
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
          }}
        >
          <h2 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "0.5rem", color: "#2a2829" }}>
            {mostRecentEntry.title}
          </h2>
          <p style={{ textAlign: "center", fontSize: "1rem", color: "#666", marginBottom: "1.5rem" }}>
            By {mostRecentEntry.author} - {mostRecentEntry.date ? new Date(mostRecentEntry.date).toLocaleDateString() : ''}
          </p>
          {mostRecentEntry.image && (
            <img
              src={mostRecentEntry.image}
              alt={mostRecentEntry.title || "Journal entry"}
              style={{ width: "100%", height: "auto", marginBottom: "0.5rem", borderRadius: "8px" }}
            />
          )}
          {mostRecentEntry.caption && (
            <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#888", fontStyle: "italic", marginBottom: "1rem" }}>
              {mostRecentEntry.caption}
            </p>
          )}
        </div>
      </Link>
    </main>
  );
}
