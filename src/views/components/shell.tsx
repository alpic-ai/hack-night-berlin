import type { ReactNode } from "react";

import { cn } from "@alpic-ai/ui/lib/cn";

import { Mountains } from "./mountains.js";

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
