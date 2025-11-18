import { prisma } from "@/lib/prisma";

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
      <p>{entry.text}</p>
    </main>
  );
}
