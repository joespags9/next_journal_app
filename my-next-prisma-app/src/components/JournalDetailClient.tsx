"use client";

import { useRef } from "react";
import ExportPdfButton from "./ExportPdfButton";

interface Entry {
  id: number;
  title: string | null;
  author: string | null;
  date: Date | null;
  caption: string | null;
  image: string | null;
  text: string | null;
}

interface JournalDetailClientProps {
  entry: Entry;
  parsedText: React.ReactNode;
}

export default function JournalDetailClient({ entry, parsedText }: JournalDetailClientProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <main style={{ padding: "2rem", width: "70%", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
        <ExportPdfButton
          contentRef={contentRef}
          filename={entry.title || "journal-entry"}
        />
      </div>

      <div ref={contentRef} style={{ padding: "2rem" }}>
        <h1 style={{ textAlign: "center", fontSize: "60px", marginBottom: "0.5rem", fontFamily: "Inter, sans-serif", fontWeight: "550", color: "rgba(36, 53, 81, 1)" }}>
          {entry.title}
        </h1>
        <p style={{ textAlign: "center", fontSize: "1rem", color: "#666", marginBottom: "1.5rem" }}>
          By {entry.author} - {entry.date ? new Date(entry.date).toLocaleDateString() : ''}
        </p>
        {entry.image && (
          <img
            src={entry.image}
            alt={entry.title || "Journal entry"}
            style={{ width: "100%", height: "auto", marginBottom: "0.5rem", borderRadius: "4px" }}
            crossOrigin="anonymous"
          />
        )}
        {entry.caption && (
          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#888", fontStyle: "italic", marginBottom: "1rem" }}>
            {entry.caption}
          </p>
        )}
        <div style={{ whiteSpace: "pre-wrap" }}>
          {parsedText}
        </div>
      </div>
    </main>
  );
}
