"use client";

import { useEffect } from "react";

export function useSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      const isEditable =
        tag === "input" || tag === "textarea" || (e.target as HTMLElement).isContentEditable;

      // Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpen();
        return;
      }

      // Backslash "/" — only when not in an input
      if (e.key === "/" && !isEditable) {
        e.preventDefault();
        onOpen();
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpen]);
}