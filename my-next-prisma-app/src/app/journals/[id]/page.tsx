import { prisma } from "@/lib/prisma";

// Function to parse markdown images and convert to React elements
function parseTextWithImages(text: string | null) {
  if (!text) return null;

  // Regex to match markdown image syntax: ![alt](src)
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = imageRegex.exec(text)) !== null) {
    // Add text before the image
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {text.substring(lastIndex, match.index)}
        </span>
      );
    }

    // Add the image
    const altText = match[1];
    const imageSrc = match[2];
    parts.push(
      <img
        key={`img-${match.index}`}
        src={imageSrc}
        alt={altText}
        style={{
          maxWidth: "100%",
          height: "auto",
          margin: "1rem 0",
          borderRadius: "4px",
          display: "block"
        }}
      />
    );

    lastIndex = imageRegex.lastIndex;
  }

  // Add remaining text after the last image
  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-${lastIndex}`}>
        {text.substring(lastIndex)}
      </span>
    );
  }

  return parts.length > 0 ? parts : text;
}

export default async function JournalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idString } = await params;
  const id = Number(idString);

  const entry = await prisma.journals.findUnique({
    where: { id },
  });

  if (!entry) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>Entry not found</h1>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "0.5rem" }}>{entry.title}</h1>
      <p style={{ textAlign: "center", fontSize: "1rem", color: "#666", marginBottom: "1.5rem" }}>
        By {entry.author} - {entry.date ? new Date(entry.date).toLocaleDateString() : ''}
      </p>
      {entry.image && (
        <img
          src={entry.image}
          alt={entry.title || "Journal entry"}
          style={{ width: "100%", height: "auto", marginBottom: "0.5rem", borderRadius: "4px" }}
        />
      )}
      {entry.caption && (
        <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#888", fontStyle: "italic", marginBottom: "1rem" }}>
          {entry.caption}
        </p>
      )}
      <div style={{ whiteSpace: "pre-wrap" }}>
        {parseTextWithImages(entry.text)}
      </div>
    </main>
  );
}
