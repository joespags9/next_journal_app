"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Select, MenuItem, IconButton, Box, FormControl, InputLabel } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import InsertLinkIcon from "@mui/icons-material/InsertLink";

export default function NewEntryPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [text, setText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<"descriptors" | "text" | "preview">("descriptors");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Roboto");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [textColor, setTextColor] = useState("#000000");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const previousTabRef = useRef<"descriptors" | "text" | "preview">("descriptors");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };

    if (showColorPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPicker]);

  // Sync contentEditable with text state when switching TO the text tab
  useEffect(() => {
    // Only rebuild if we're switching TO the text tab from another tab
    if (activeTab === "text" && previousTabRef.current !== "text" && contentEditableRef.current) {
      // Clear and rebuild the content
      contentEditableRef.current.innerHTML = "";

      // Parse the text and recreate the content with images
      if (text) {
        const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
        let lastIndex = 0;
        let match;

        while ((match = imageRegex.exec(text)) !== null) {
          // Add text before the image
          if (match.index > lastIndex) {
            const textNode = document.createTextNode(text.substring(lastIndex, match.index));
            contentEditableRef.current.appendChild(textNode);
          }

          // Add the image
          const img = document.createElement("img");
          img.src = match[2];
          img.style.maxWidth = "100%";
          img.style.height = "auto";
          img.style.margin = "1rem 0";
          img.style.borderRadius = "4px";
          img.style.display = "block";
          img.style.cursor = "pointer";
          img.draggable = false;

          // Make image resizable
          img.addEventListener("mousedown", (evt) => {
            evt.preventDefault();
            const startX = evt.clientX;
            const startWidth = img.offsetWidth;
            const container = contentEditableRef.current;
            if (!container) return;
            const containerWidth = container.offsetWidth;

            const handleMouseMove = (moveEvt: MouseEvent) => {
              const deltaX = moveEvt.clientX - startX;
              const newWidth = startWidth + deltaX;
              if (newWidth > 50 && newWidth <= containerWidth) {
                img.style.width = newWidth + "px";
                img.style.maxWidth = "100%";
              }
            };

            const handleMouseUp = () => {
              document.removeEventListener("mousemove", handleMouseMove);
              document.removeEventListener("mouseup", handleMouseUp);
            };

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
          });

          contentEditableRef.current.appendChild(img);
          lastIndex = imageRegex.lastIndex;
        }

        // Add remaining text after the last image
        if (lastIndex < text.length) {
          const textNode = document.createTextNode(text.substring(lastIndex));
          contentEditableRef.current.appendChild(textNode);
        }
      }
    }

    // Update the previous tab
    previousTabRef.current = activeTab;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Material-UI default font families
  const fontFamilies = [
    "Roboto",
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Georgia",
    "Courier New",
    "Verdana",
    "Trebuchet MS",
    "Comic Sans MS",
    "Impact",
    "Lucida Console",
    "Tahoma",
    "Palatino",
    "Garamond",
    "Bookman",
    "Avant Garde",
    "monospace",
    "serif",
    "sans-serif",
    "cursive",
    "fantasy"
  ];

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
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

  const handleDropAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddLink = () => {
    const url = prompt("Enter the URL:");
    if (!url) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      alert("Please select some text first");
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (!selectedText) {
      alert("Please select some text first");
      return;
    }

    const link = document.createElement("a");
    link.href = url;
    link.textContent = selectedText;
    link.style.color = "#0070f3";
    link.style.textDecoration = "underline";
    link.target = "_blank";

    range.deleteContents();
    range.insertNode(link);

    // Update the text state
    if (contentEditableRef.current) {
      let content = "";
      contentEditableRef.current.childNodes.forEach(node => {
        if (node.nodeName === "A") {
          const anchor = node as HTMLAnchorElement;
          content += `[${anchor.textContent}](${anchor.href})`;
        } else if (node.nodeName === "IMG") {
          const img = node as HTMLImageElement;
          content += `\n![Image](${img.src})\n`;
        } else if (node.nodeName === "BR") {
          content += "\n";
        } else {
          content += node.textContent || "";
        }
      });
      setText(content);
    }
  };

  const handleTextAreaDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleTextAreaDrop = (e: React.DragEvent) => {
    e.preventDefault();

    const textarea = e.target as HTMLTextAreaElement;
    const cursorPosition = textarea.selectionStart;
    const textBefore = text.substring(0, cursorPosition);
    const textAfter = text.substring(cursorPosition);

    // Check if it's a file being dragged
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        // Convert image file to base64 data URL
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const imageData = event.target.result as string;
            const imageMarkdown = `\n![Image](${imageData})\n`;
            setText(textBefore + imageMarkdown + textAfter);
          }
        };
        reader.readAsDataURL(file);
      }
    } else {
      // Check if it's an image URL being dragged (from a webpage)
      const imageUrl = e.dataTransfer.getData("text/html");
      const urlMatch = imageUrl.match(/src="([^"]+)"/);

      if (urlMatch && urlMatch[1]) {
        const imageSrc = urlMatch[1];
        const imageMarkdown = `\n![Image](${imageSrc})\n`;
        setText(textBefore + imageMarkdown + textAfter);
      } else {
        // Try getting plain text URL
        const plainUrl = e.dataTransfer.getData("text/plain");
        if (plainUrl && (plainUrl.startsWith("http") || plainUrl.startsWith("data:"))) {
          const imageMarkdown = `\n![Image](${plainUrl})\n`;
          setText(textBefore + imageMarkdown + textAfter);
        }
      }
    }
  };

  // Function to parse markdown images and render preview
  function parseTextWithImages(text: string) {
    if (!text) return null;

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

  return (
    <main style={{ padding: "2rem", maxWidth: activeTab === "descriptors" ? "600px" : "none", width: activeTab === "descriptors" ? "auto" : "70%", margin: "0 auto" }}>
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #999;
          pointer-events: none;
          position: absolute;
        }
      `}</style>
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        {/* Tabs */}
        <div style={{ display: "flex", marginBottom: "1rem", borderBottom: "2px solid #ccc" }}>
          <button
            type="button"
            onClick={() => setActiveTab("descriptors")}
            style={{
              flex: 1,
              padding: "0.75rem",
              cursor: "pointer",
              border: "none",
              borderBottom: activeTab === "descriptors" ? "3px solid rgba(42, 40, 41)" : "none",
              backgroundColor: activeTab === "descriptors" ? "white" : "#f5f5f5",
              fontWeight: activeTab === "descriptors" ? "bold" : "normal",
              fontSize: "1rem",
              transition: "all 0.2s ease"
            }}
          >
            Descriptors
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("text")}
            style={{
              flex: 1,
              padding: "0.75rem",
              cursor: "pointer",
              border: "none",
              borderBottom: activeTab === "text" ? "3px solid rgba(42, 40, 41)" : "none",
              backgroundColor: activeTab === "text" ? "white" : "#f5f5f5",
              fontWeight: activeTab === "text" ? "bold" : "normal",
              fontSize: "1rem",
              transition: "all 0.2s ease"
            }}
          >
            Text
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            style={{
              flex: 1,
              padding: "0.75rem",
              cursor: "pointer",
              border: "none",
              borderBottom: activeTab === "preview" ? "3px solid rgba(42, 40, 41)" : "none",
              backgroundColor: activeTab === "preview" ? "white" : "#f5f5f5",
              fontWeight: activeTab === "preview" ? "bold" : "normal",
              fontSize: "1rem",
              transition: "all 0.2s ease"
            }}
          >
            Preview
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "descriptors" && (
          <div>
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
                onClick={handleDropAreaClick}
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
                    Drop Image Here or Click to Select
                  </p>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
            </div>
          </div>
        )}

        {activeTab === "text" && (
          <div>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", marginBottom: 2, flexWrap: "wrap" }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="font-family-label">Font</InputLabel>
                <Select
                  labelId="font-family-label"
                  value={fontFamily}
                  label="Font"
                  onChange={(e) => setFontFamily(e.target.value)}
                >
                  {fontFamilies.map((font) => (
                    <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel id="font-size-label">Size</InputLabel>
                <Select
                  labelId="font-size-label"
                  value={fontSize}
                  label="Size"
                  onChange={(e) => setFontSize(Number(e.target.value))}
                >
                  {[8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32].map((size) => (
                    <MenuItem key={size} value={size}>{size}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IconButton
                onClick={() => setIsBold(!isBold)}
                color={isBold ? "primary" : "default"}
                sx={{ border: "1px solid #ccc" }}
              >
                <FormatBoldIcon />
              </IconButton>
              <IconButton
                onClick={() => setIsItalic(!isItalic)}
                color={isItalic ? "primary" : "default"}
                sx={{ border: "1px solid #ccc" }}
              >
                <FormatItalicIcon />
              </IconButton>
              <IconButton
                onClick={() => setIsUnderline(!isUnderline)}
                color={isUnderline ? "primary" : "default"}
                sx={{ border: "1px solid #ccc" }}
              >
                <FormatUnderlinedIcon />
              </IconButton>
              <IconButton
                onClick={() => setIsStrikethrough(!isStrikethrough)}
                color={isStrikethrough ? "primary" : "default"}
                sx={{ border: "1px solid #ccc" }}
              >
                <StrikethroughSIcon />
              </IconButton>
              <IconButton
                onClick={handleAddLink}
                sx={{ border: "1px solid #ccc" }}
              >
                <InsertLinkIcon />
              </IconButton>
              <Box ref={colorPickerRef} sx={{ position: "relative", display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  sx={{ border: "1px solid #ccc" }}
                >
                  <FormatColorTextIcon sx={{ color: textColor }} />
                </IconButton>
                {showColorPicker && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      zIndex: 10,
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "0.75rem",
                      marginTop: "0.25rem",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      minWidth: "200px"
                    }}
                  >
                    <div style={{ marginBottom: "0.5rem", fontSize: "0.75rem", fontWeight: "bold", color: "#666" }}>
                      Preset Colors
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.25rem", marginBottom: "0.75rem" }}>
                      {["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080", "#008000", "#808080", "#FFFFFF"].map((color) => (
                        <div
                          key={color}
                          onClick={() => setTextColor(color)}
                          style={{
                            width: "24px",
                            height: "24px",
                            backgroundColor: color,
                            border: textColor === color ? "2px solid #000" : "1px solid #ccc",
                            borderRadius: "4px",
                            cursor: "pointer",
                            boxShadow: color === "#FFFFFF" ? "inset 0 0 0 1px #ddd" : "none"
                          }}
                        />
                      ))}
                    </div>
                    <div style={{ marginBottom: "0.25rem", fontSize: "0.75rem", fontWeight: "bold", color: "#666" }}>
                      Custom Color
                    </div>
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      style={{ width: "100%", height: "30px", cursor: "pointer", border: "1px solid #ccc", borderRadius: "4px" }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
            <div
              ref={contentEditableRef}
              contentEditable
              onInput={(e) => {
                const target = e.currentTarget;
                // Extract text and images as markdown
                let content = "";
                target.childNodes.forEach(node => {
                  if (node.nodeName === "IMG") {
                    const img = node as HTMLImageElement;
                    content += `\n![Image](${img.src})\n`;
                  } else if (node.nodeName === "BR") {
                    content += "\n";
                  } else {
                    content += node.textContent || "";
                  }
                });
                setText(content);
              }}
              onDragOver={handleTextAreaDragOver}
              onDrop={(e) => {
                e.preventDefault();

                const files = e.dataTransfer.files;
                if (files && files[0]) {
                  const file = files[0];
                  if (file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      if (event.target?.result) {
                        const container = e.currentTarget;
                        const img = document.createElement("img");
                        img.src = event.target.result as string;
                        img.style.maxWidth = "100%";
                        img.style.height = "auto";
                        img.style.margin = "1rem 0";
                        img.style.borderRadius = "4px";
                        img.style.display = "block";
                        img.style.cursor = "pointer";
                        img.style.resize = "both";
                        img.style.overflow = "auto";
                        img.draggable = false;

                        // Make image resizable
                        img.addEventListener("mousedown", (evt) => {
                          evt.preventDefault();
                          const startX = evt.clientX;
                          const startWidth = img.offsetWidth;
                          const containerWidth = container.offsetWidth;

                          const handleMouseMove = (moveEvt: MouseEvent) => {
                            const deltaX = moveEvt.clientX - startX;
                            const newWidth = startWidth + deltaX;
                            if (newWidth > 50 && newWidth <= containerWidth) {
                              img.style.width = newWidth + "px";
                              img.style.maxWidth = "100%";
                            }
                          };

                          const handleMouseUp = () => {
                            document.removeEventListener("mousemove", handleMouseMove);
                            document.removeEventListener("mouseup", handleMouseUp);
                          };

                          document.addEventListener("mousemove", handleMouseMove);
                          document.addEventListener("mouseup", handleMouseUp);
                        });

                        container.appendChild(img);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                } else {
                  const container = e.currentTarget;
                  const imageUrl = e.dataTransfer.getData("text/html");
                  const urlMatch = imageUrl.match(/src="([^"]+)"/);

                  if (urlMatch && urlMatch[1]) {
                    const img = document.createElement("img");
                    img.src = urlMatch[1];
                    img.style.maxWidth = "100%";
                    img.style.height = "auto";
                    img.style.margin = "1rem 0";
                    img.style.borderRadius = "4px";
                    img.style.display = "block";
                    img.style.cursor = "pointer";
                    img.draggable = false;

                    // Make image resizable
                    img.addEventListener("mousedown", (evt) => {
                      evt.preventDefault();
                      const startX = evt.clientX;
                      const startWidth = img.offsetWidth;
                      const containerWidth = container.offsetWidth;

                      const handleMouseMove = (moveEvt: MouseEvent) => {
                        const deltaX = moveEvt.clientX - startX;
                        const newWidth = startWidth + deltaX;
                        if (newWidth > 50 && newWidth <= containerWidth) {
                          img.style.width = newWidth + "px";
                          img.style.maxWidth = "100%";
                        }
                      };

                      const handleMouseUp = () => {
                        document.removeEventListener("mousemove", handleMouseMove);
                        document.removeEventListener("mouseup", handleMouseUp);
                      };

                      document.addEventListener("mousemove", handleMouseMove);
                      document.addEventListener("mouseup", handleMouseUp);
                    });

                    container.appendChild(img);
                  } else {
                    const plainUrl = e.dataTransfer.getData("text/plain");
                    if (plainUrl && (plainUrl.startsWith("http") || plainUrl.startsWith("data:"))) {
                      const img = document.createElement("img");
                      img.src = plainUrl;
                      img.style.maxWidth = "100%";
                      img.style.height = "auto";
                      img.style.margin = "1rem 0";
                      img.style.borderRadius = "4px";
                      img.style.display = "block";
                      img.style.cursor = "pointer";
                      img.draggable = false;

                      // Make image resizable
                      img.addEventListener("mousedown", (evt) => {
                        evt.preventDefault();
                        const startX = evt.clientX;
                        const startWidth = img.offsetWidth;
                        const containerWidth = container.offsetWidth;

                        const handleMouseMove = (moveEvt: MouseEvent) => {
                          const deltaX = moveEvt.clientX - startX;
                          const newWidth = startWidth + deltaX;
                          if (newWidth > 50 && newWidth <= containerWidth) {
                            img.style.width = newWidth + "px";
                            img.style.maxWidth = "100%";
                          }
                        };

                        const handleMouseUp = () => {
                          document.removeEventListener("mousemove", handleMouseMove);
                          document.removeEventListener("mouseup", handleMouseUp);
                        };

                        document.addEventListener("mousemove", handleMouseMove);
                        document.addEventListener("mouseup", handleMouseUp);
                      });

                      container.appendChild(img);
                    }
                  }
                }
              }}
              data-placeholder="Text (You can drag and drop images here)"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                width: "100%",
                minHeight: "500px",
                padding: "0.75rem",
                border: "2px solid #ccc",
                borderRadius: "4px",
                fontFamily: fontFamily,
                fontSize: `${fontSize}px`,
                fontWeight: isBold ? "bold" : "normal",
                fontStyle: isItalic ? "italic" : "normal",
                textDecoration: `${isUnderline ? "underline" : ""} ${isStrikethrough ? "line-through" : ""}`.trim() || "none",
                color: textColor,
                backgroundColor: "white",
                whiteSpace: "pre-wrap",
                overflowY: "auto"
              }}
              suppressContentEditableWarning
            />
          </div>
        )}

        {activeTab === "preview" && (
          <div>
            <h1 style={{ textAlign: "center", fontSize: "60px", marginBottom: "0.5rem", fontFamily: "Inter, sans-serif", fontWeight: "550", color: "rgba(36, 53, 81, 1)" }}>
              {title || "Untitled"}
            </h1>
            <p style={{ textAlign: "center", fontSize: "1rem", color: "#666", marginBottom: "1.5rem" }}>
              By {author || "Unknown"} - {new Date().toLocaleDateString()}
            </p>
            {image && (
              <img
                src={image}
                alt={title || "Journal entry"}
                style={{ width: "100%", height: "auto", marginBottom: "0.5rem", borderRadius: "4px" }}
              />
            )}
            {caption && (
              <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#888", fontStyle: "italic", marginBottom: "1rem" }}>
                {caption}
              </p>
            )}
            <div style={{ whiteSpace: "pre-wrap" }}>
              {parseTextWithImages(text)}
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
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
            </div>
          </div>
        )}
      </form>
    </main>
  );
}
