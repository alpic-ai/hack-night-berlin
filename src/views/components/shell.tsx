import type { ReactNode } from "react";
import { useRequestClose, useSendFollowUpMessage } from "skybridge/web";

import { cn } from "@alpic-ai/ui/lib/cn";

import { Mountains } from "./mountains.js";

/**
 * Universal "close this view" handler that works across hosts.
 *
 * 1. Try the host's native close (Alpic playground supports this).
 * 2. If the host doesn't implement requestClose (e.g. ChatGPT's Apps SDK
 *    currently doesn't, throws "window.openai.requestClose is not a
 *    function"), fall back to sending a short follow-up message so the
 *    user can move past the view in chat instead of being stuck.
 * 3. Last resort: swallow silently rather than crash the view.
 */
export function useViewClose(): () => void {
  const requestClose = useRequestClose();
  const sendFollowUp = useSendFollowUpMessage();
  return () => {
    try {
      void requestClose();
    } catch {
      try {
        void sendFollowUp("Close this view, thanks.");
      } catch {
        /* host supports neither — give up */
      }
    }
  };
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
