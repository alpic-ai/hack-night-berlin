import "@/index.css";

import { useState } from "react";
import { useCallTool, useLayout, useToolInfo } from "skybridge/web";
import { Button } from "@alpic-ai/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@alpic-ai/ui/components/card";
import { Input } from "@alpic-ai/ui/components/input";
import { Label } from "@alpic-ai/ui/components/label";
import { Textarea } from "@alpic-ai/ui/components/textarea";
import { CheckCircle2, ExternalLink, X } from "lucide-react";

import { Shell, useViewClose } from "./components/shell.js";

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Close"
      onClick={onClick}
      className="absolute right-3 top-3 z-10 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
    >
      <X className="size-4" />
    </button>
  );
}

const SUBMISSIONS_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1V-Ma6ZwWeRMkuhraRZu2iu6cq1n2uZcUEeaQAJg5Xi4/edit?usp=sharing";

type SubmitInput = {
  team_name?: string;
  emails?: string;
  repo_url?: string;
  video_url?: string;
  mcp_url?: string;
  notes?: string;
};

type SubmitOutput = {
  ok: boolean;
  message: string;
};

export default function SubmitProject() {
  const { theme } = useLayout();
  const info = useToolInfo<{ input: SubmitInput; output: SubmitOutput }>();
  const { callToolAsync } = useCallTool<SubmitInput>("submit_project");
  const close = useViewClose();

  const prefill = info.input ?? {};
  const [team, setTeam] = useState(prefill.team_name ?? "");
  const [emails, setEmails] = useState(prefill.emails ?? "");
  const [repo, setRepo] = useState(prefill.repo_url ?? "");
  const [video, setVideo] = useState(prefill.video_url ?? "");
  const [mcpUrl, setMcpUrl] = useState(prefill.mcp_url ?? "");
  const [notes, setNotes] = useState(prefill.notes ?? "");
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);

  const canSubmit =
    team.trim().length > 0 &&
    emails.trim().length > 0 &&
    repo.trim().length > 0 &&
    video.trim().length > 0 &&
    mcpUrl.trim().length > 0 &&
    !pending;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setPending(true);
    try {
      await callToolAsync({
        team_name: team,
        emails,
        repo_url: repo,
        video_url: video,
        mcp_url: mcpUrl,
        notes,
      });
      setSubmitted(true);
    } finally {
      setPending(false);
    }
  }

  if (submitted || info.output?.ok) {
    return (
      <Shell theme={theme}>
        <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-12">
          <Card className="relative">
            <CloseButton onClick={close} />
            <CardContent className="flex flex-col items-center gap-4 text-center">
              <CheckCircle2 className="text-primary size-12" />
              <h3 className="type-display-xs font-bold">Submission received</h3>
              <p className="type-text-sm text-muted-foreground">
                You're in. Submissions stay open until Sunday May 31 at 23:59 — you
                can resubmit with edits any time before that.
              </p>
            </CardContent>
          </Card>
        </div>
      </Shell>
    );
  }

  return (
    <Shell theme={theme}>
      <div className="mx-auto flex max-w-xl flex-col gap-6 px-6 py-10">
        <header className="flex flex-col items-center gap-2 text-center">
          <h2 className="type-display-sm font-bold">Submit your GPT App</h2>
          <p className="type-text-sm text-muted-foreground">Save your progress</p>
        </header>

        <Card className="relative">
          <CloseButton onClick={close} />
          <CardHeader>
            <CardTitle>Submission details</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-5" onSubmit={onSubmit}>
              <Input
                label="Team name"
                required
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                placeholder="e.g. The Currywurst Crew"
              />

              <Input
                label="Team emails (comma-separated)"
                required
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="you@example.com, partner@example.com"
              />

              <Input
                label="GitHub repo URL"
                type="url"
                required
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="https://github.com/you/your-gpt-app"
              />

              <Input
                label="MCP App URL"
                hint="The deployed MCP/GPT App endpoint judges can connect to."
                type="url"
                required
                value={mcpUrl}
                onChange={(e) => setMcpUrl(e.target.value)}
                placeholder="https://your-app.alpic.app/mcp"
              />

              <Input
                label="Video demo URL"
                type="url"
                required
                value={video}
                onChange={(e) => setVideo(e.target.value)}
                placeholder="https://youtu.be/..."
              />

              <div className="flex flex-col gap-2">
                <Label htmlFor="notes">Notes for the judges (optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What it does, why you built it, anything we should know."
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <a
                  href={SUBMISSIONS_SHEET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-text-xs text-muted-foreground inline-flex items-center gap-1 hover:text-primary"
                >
                  Submissions go to <ExternalLink className="size-3" />
                </a>
                <Button variant="primary" type="submit" disabled={!canSubmit}>
                  {pending ? "Saving…" : "Submit"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
