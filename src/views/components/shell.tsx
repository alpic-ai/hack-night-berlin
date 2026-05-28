import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { cn } from "@alpic-ai/ui/lib/cn";

import { Mountains } from "./mountains.js";

/**
 * True only when the MCP host actually implements requestClose. ChatGPT's
 * Apps SDK currently doesn't, and calling the hook throws. Use this to
 * gate the rendering of close buttons so they're never visible when broken.
 */
export function useHostCanClose(): boolean {
  const [canClose, setCanClose] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as Record<string, any>;
    setCanClose(
      typeof w.openai?.requestClose === "function" ||
        typeof w.skybridge?.requestClose === "function",
    );
  }, []);
  return canClose;
}

/**
 * Safe wrapper around the requestClose function returned by useRequestClose.
 * Swallows the host-not-supported error so a misfire never crashes the view.
 */
export function safeRequestClose(requestClose: () => Promise<void> | void) {
  try {
    void requestClose();
  } catch {
    /* host doesn't implement close — silently ignore */
  }
}

export function Shell({
  theme,
  children,
  mountains = "footer",
}: {
  theme: string | undefined;
  children: ReactNode;
  mountains?: "footer" | "none";
}) {
  return (
    <div className={cn(theme === "dark" && "dark")}>
      <div className="relative bg-background text-foreground min-h-[400px] font-sans overflow-hidden">
        <div className="relative z-10">{children}</div>
        {mountains === "footer" && (
          <Mountains
            className="z-0 h-32 opacity-25 [aspect-ratio:auto]"
            dim
          />
        )}
      </div>
    </div>
  );
}
