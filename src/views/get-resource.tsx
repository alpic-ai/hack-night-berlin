import "@/index.css";

import { useLayout, useToolInfo } from "skybridge/web";
import { Badge } from "@alpic-ai/ui/components/badge";
import { Button } from "@alpic-ai/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@alpic-ai/ui/components/card";
import { ExternalLink } from "lucide-react";

import { findResource } from "./components/resources.js";
import { Shell } from "./components/shell.js";

export default function GetResource() {
  const { theme } = useLayout();
  const info = useToolInfo<{ input: { name?: string } }>();
  const query = info.input?.name;
  const r = findResource(query);

  if (!r) {
    return (
      <Shell theme={theme}>
        <div className="mx-auto flex max-w-lg flex-col gap-4 px-6 py-10">
          <Card>
            <CardHeader>
              <CardTitle>Resource not found</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="type-text-sm text-muted-foreground">
                {query ? <>No match for <em className="text-foreground">"{query}"</em>.</> : <>No keyword provided.</>}
              </p>
              <div className="flex flex-wrap gap-2">
                {["starter", "quickstart", "skybridge", "claude code", "mcp docs"].map((t) => (
                  <Badge key={t} variant="secondary">{t}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Shell>
    );
  }

  return (
    <Shell theme={theme}>
      <div className="mx-auto flex max-w-xl flex-col gap-6 px-6 py-10">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="text-4xl leading-none">{r.icon}</span>
              <div className="flex flex-col gap-1">
                <Badge variant="primary" className="w-fit">Power-up unlocked</Badge>
                <CardTitle className="type-display-xs">{r.title}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <p className="type-text-md text-foreground leading-relaxed">{r.longDesc}</p>
            <Button asChild variant="primary">
              <a href={r.url} target="_blank" rel="noopener noreferrer">
                Open {r.title}
                <ExternalLink className="size-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
