"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewEntryPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [text, setText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/entries", {
      method: "POST",
      body: JSON.stringify({ title, author, caption, image, text }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      // Clear form
      setTitle("");
      setAuthor("");
      setCaption("");
      setImage("");
      setText("");
      // Redirect to archive page
      router.push("/archive");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        // Convert image to base64 data URL
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImage(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            display: "block",
            marginBottom: "0.5rem",
            width: "100%",
            padding: "0.75rem",
            border: "2px solid #ccc",
            borderRadius: "4px",
            fontSize: "1rem"
          }}
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={{
            display: "block",
            marginBottom: "0.5rem",
            width: "100%",
            padding: "0.75rem",
            border: "2px solid #ccc",
            borderRadius: "4px",
            fontSize: "1rem"
          }}
        />
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          style={{
            display: "block",
            marginBottom: "0.5rem",
            width: "100%",
            padding: "0.75rem",
            border: "2px solid #ccc",
            borderRadius: "4px",
            fontSize: "1rem"
          }}
        />
        <div style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem", alignItems: "stretch" }}>
          <div style={{ flex: "0 0 33.333%", display: "flex", flexDirection: "column" }}>
            <button
              type="button"
              onClick={() => window.open("https://images.google.com", "_blank")}
              style={{
                width: "100%",
                padding: "0.75rem",
                marginBottom: "0.5rem",
                cursor: "pointer",
                border: "2px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "white",
                fontWeight: "500",
              }}
            >
              Open Google Images
            </button>
            <input
              type="text"
              placeholder="Paste Image URL here"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #ccc",
                borderRadius: "4px",
                fontSize: "1rem"
              }}
            />
          </div>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              flex: "0 0 66.666%",
              minHeight: "0",
              border: isDragging ? "2px dashed #4CAF50" : "2px dashed #ccc",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isDragging ? "#f0f8f0" : "white",
              overflow: "hidden",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
          >
            {image ? (
              <img
                src={image}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <p style={{ color: "#999", fontSize: "0.9rem", textAlign: "center", padding: "1rem" }}>
                Drop Image Here
              </p>
            )}
          </div>
        </div>
        <textarea
          placeholder="Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          style={{
            display: "block",
            marginBottom: "0.5rem",
            width: "100%",
            padding: "0.75rem",
            border: "2px solid #ccc",
            borderRadius: "4px",
            fontSize: "1rem"
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.75rem 1.5rem",
            cursor: "pointer",
            border: "2px solid #ccc",
            borderRadius: "4px",
            backgroundColor: "rgba(42, 40, 41)",
            color: "white",
            fontWeight: "bold"
          }}
        >
          Add Entry
        </button>
      </form>
    </main>
  );
}
