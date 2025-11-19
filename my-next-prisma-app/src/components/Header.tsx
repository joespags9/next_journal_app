"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";

export default function Header() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ backgroundColor: "rgba(42, 40, 41)", padding: "1rem 1.5rem" }}>
        <div style={{ color: "white", fontSize: "1.25rem" }}>Journal App</div>
      </div>
    );
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: "rgba(42, 40, 41)" }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "inherit",
            cursor: "pointer",
          }}
        >
          Journal App
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" component={Link} href="/archive">
            Archive
          </Button>
          <Button color="inherit" component={Link} href="/new-entry">
            New Entry
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
