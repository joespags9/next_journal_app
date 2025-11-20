import { prisma } from "@/lib/prisma";
import JournalDetailClient from "@/components/JournalDetailClient";

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
    <JournalDetailClient
      entry={entry}
    />
  );
}
