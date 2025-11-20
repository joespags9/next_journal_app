"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ExportPdfButtonProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
  filename: string;
}

export default function ExportPdfButton({ contentRef, filename }: ExportPdfButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = async () => {
    if (!contentRef.current) return;

    setIsExporting(true);

    try {
      // Capture the content as a canvas
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "rgba(224, 224, 220)",
        width: contentRef.current.scrollWidth,
        windowWidth: contentRef.current.scrollWidth,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        canvas.width,
        canvas.height
      );

      pdf.save(`${filename}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExportPdf}
      disabled={isExporting}
      style={{
        padding: "0.75rem 1.5rem",
        backgroundColor: isExporting ? "#999" : "#0070f3",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "1rem",
        cursor: isExporting ? "not-allowed" : "pointer",
        transition: "background-color 0.2s",
        marginBottom: "1rem",
      }}
      onMouseEnter={(e) => {
        if (!isExporting) {
          e.currentTarget.style.backgroundColor = "#0051cc";
        }
      }}
      onMouseLeave={(e) => {
        if (!isExporting) {
          e.currentTarget.style.backgroundColor = "#0070f3";
        }
      }}
    >
      {isExporting ? "Generating PDF..." : "Export as PDF"}
    </button>
  );
}
