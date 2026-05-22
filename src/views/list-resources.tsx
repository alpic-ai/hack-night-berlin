import "@/index.css";

import { useLayout } from "skybridge/web";
import { Card, CardContent } from "@alpic-ai/ui/components/card";
import { ExternalLink } from "lucide-react";

import { RESOURCES } from "./components/resources.js";
import { Shell } from "./components/shell.js";

export default function ListResources() {
  const { theme } = useLayout();
  return (
    <Shell theme={theme}>
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10">
        <header className="flex flex-col items-center gap-2 text-center">
          <h2 className="type-display-sm font-bold">Power-ups</h2>
          <p className="type-text-sm text-muted-foreground">
            Resources to level up your build
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map((r) => (
            <a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card hoverable className="h-full">
                <CardContent className="flex items-start gap-3">
                  <span className="text-3xl leading-none">{r.icon}</span>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="type-text-md font-semibold">{r.title}</p>
                      <ExternalLink className="text-muted-foreground size-4 shrink-0" />
                    </div>
                    <p className="type-text-sm text-muted-foreground">{r.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        <p className="type-text-sm text-muted-foreground text-center">
          Ask <em className="text-primary not-italic">"where do I start?"</em> or
          <em className="text-primary not-italic"> "show me the MCP docs"</em> to
          jump straight to one.
        </p>
      </div>
    </Shell>
  );
}
