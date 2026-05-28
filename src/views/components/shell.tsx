import type { ReactNode } from "react";
import { useSendFollowUpMessage } from "skybridge/web";
import { Gamepad2, MapPin, Rocket, Sparkles } from "lucide-react";

import { cn } from "@alpic-ai/ui/lib/cn";

import { Mountains } from "./mountains.js";

const NEXT_ACTIONS = [
  {
    icon: Gamepad2,
    title: "Distract me",
    prompt: "I'm bored, play a game",
  },
  {
    icon: MapPin,
    title: "Event info",
    prompt: "What time does it start?",
  },
  {
    icon: Rocket,
    title: "Submit your project",
    prompt: "I want to submit my project",
  },
  {
    icon: Sparkles,
    title: "Resources",
    prompt: "Where do I start?",
  },
];

function NextActions() {
  const sendFollowUp = useSendFollowUpMessage();
  return (
    <div className="border-border border-t bg-muted/30 px-6 py-6 mt-8">
      <p className="type-text-xs text-muted-foreground text-center uppercase tracking-[0.2em] mb-4">
        What next?
      </p>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
        {NEXT_ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.title}
              type="button"
              onClick={() => sendFollowUp(a.prompt)}
              className={cn(
                "flex flex-col items-start gap-1 rounded-lg border border-border bg-background",
                "px-4 py-3 text-left transition-colors",
                "[@media(hover:hover)]:hover:border-primary [@media(hover:hover)]:hover:bg-primary/5",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              )}
            >
              <span className="text-primary inline-flex items-center gap-2 type-text-sm font-semibold">
                <Icon className="size-4" />
                {a.title}
              </span>
              <span className="type-text-xs text-muted-foreground">
                <em className="not-italic">"{a.prompt}"</em>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Shell({
  theme,
  children,
  mountains = "footer",
  nextActions = "show",
}: {
  theme: string | undefined;
  children: ReactNode;
  mountains?: "footer" | "none";
  /** "show" (default) renders the What next? footer; "none" hides it */
  nextActions?: "show" | "none";
}) {
  return (
    <div className={cn(theme === "dark" && "dark")}>
      <div className="relative bg-background text-foreground min-h-[400px] font-sans overflow-hidden">
        <div className="relative z-10">
          {children}
          {nextActions === "show" && <NextActions />}
        </div>
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
