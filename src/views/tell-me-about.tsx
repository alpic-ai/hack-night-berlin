import "@/index.css";

import { useLayout, useToolInfo } from "skybridge/web";
import { Badge } from "@alpic-ai/ui/components/badge";
import { Button } from "@alpic-ai/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@alpic-ai/ui/components/card";
import {
  Calendar,
  HelpCircle,
  MapPin,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";

import { Shell } from "./components/shell.js";

type Topic =
  | "schedule"
  | "venue"
  | "mission"
  | "prizes"
  | "rules"
  | "judging"
  | "format"
  | "unknown";

function resolveTopic(raw: string | undefined): Topic {
  if (!raw) return "unknown";
  const s = raw.toLowerCase();
  if (/schedule|agenda|time|when|programme|program/.test(s)) return "schedule";
  if (/venue|where|location|address|map/.test(s)) return "venue";
  if (/prize|win|reward/.test(s)) return "prizes";
  if (/judg|async|winner|announce|criteria/.test(s)) return "judging";
  if (/rule|submit|deadline/.test(s)) return "rules";
  if (/format|how (does|is)|what is this|about|mission/.test(s)) return "mission";
  if (/co-?op|team|solo|player/.test(s)) return "format";
  return "unknown";
}

const SCHEDULE = [
  { time: "18:00", name: "Doors open", desc: "Grab pizza, beverages, settle in. Meet your fellow players." },
  { time: "18:30", name: "Briefing", desc: "Program overview, prize details, what makes a winning submission." },
  {
    time: "18:45",
    name: "Technical deep dive",
    desc: "GPT App development using Alpic's Skybridge open-source framework and Tools. Everything you need to start building.",
  },
  { time: "19:30", name: "Hack time · 90 min", desc: "Build your GPT App. 90 minutes on the clock. Mentors available." },
  { time: "21:00", name: "Lightning pitches", desc: "Show what you built. Quick, non-judged showcase." },
  { time: "21:15", name: "Networking", desc: "Mingle, share ideas, talk shop. Submissions open until Sunday." },
];

const PRIZES = [
  {
    rank: "1st place",
    items: ["1,500 Alpic credits", "€500 build fund", "1h CTO coaching", "Showcase feature", "Goodie bag"],
  },
  { rank: "2nd place", items: ["1,000 Alpic credits", "€250 build fund", "Goodie bag"] },
  { rank: "3rd place", items: ["500 Alpic credits", "€100 build fund", "Goodie bag"] },
];

function PanelHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="text-primary">{icon}</div>
      <h2 className="type-display-sm font-bold">{title}</h2>
      <p className="type-text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function MissionPanel() {
  return (
    <>
      <PanelHeader icon={<HelpCircle className="size-8" />} title="What is this?" subtitle="The hack-night in one screen" />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>🌟 The mission</CardTitle></CardHeader>
          <CardContent>
            <p className="type-text-sm text-muted-foreground">
              Build a functional GPT App that solves an everyday workplace
              challenge. 90 minutes to hack, then pitch to the judges.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>🎮 Co-op mode</CardTitle></CardHeader>
          <CardContent>
            <p className="type-text-sm text-muted-foreground">
              Go solo or team up with one partner. Max two per team.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>🏆 Prizes & judging</CardTitle></CardHeader>
          <CardContent>
            <p className="type-text-sm text-muted-foreground">
              Async evaluation. Submissions stay open until Sunday May 31 at 23:59.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>🍕 Fuel & vibes</CardTitle></CardHeader>
          <CardContent>
            <p className="type-text-sm text-muted-foreground">
              Pizza, beverages, and a Berlin venue. Doors at 18:00.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function SchedulePanel() {
  return (
    <>
      <PanelHeader icon={<Calendar className="size-8" />} title="Schedule" subtitle="Your journey through the evening" />
      <div className="flex flex-col gap-3">
        {SCHEDULE.map((s) => (
          <Card key={s.time}>
            <CardContent className="flex items-start gap-4">
              <Badge variant="primary" className="shrink-0">{s.time}</Badge>
              <div className="flex flex-col gap-1">
                <p className="type-text-md font-semibold">{s.name}</p>
                <p className="type-text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

function VenuePanel() {
  return (
    <>
      <PanelHeader icon={<MapPin className="size-8" />} title="Venue" subtitle="Where the level happens" />
      <Card className="mx-auto max-w-md">
        <CardContent className="flex flex-col items-center gap-3 text-center">
          <p className="type-display-xs font-bold">Mindspace Krausenstraße</p>
          <p className="type-text-sm text-muted-foreground">
            Krausenstraße 9–10
            <br />
            10117 Berlin, Germany
          </p>
          <Badge variant="secondary">May 28, 2026 · 18:00–22:00</Badge>
          <Button asChild variant="primary" className="mt-2">
            <a
              href="https://maps.app.goo.gl/rAuZeGVbZAuH1ahx5"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Maps
            </a>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

function PrizesPanel() {
  return (
    <>
      <PanelHeader icon={<Trophy className="size-8" />} title="Prizes" subtitle="Build with us — reap the rewards" />
      <div className="grid gap-4 md:grid-cols-3">
        {PRIZES.map((p, i) => (
          <Card key={p.rank}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{["🥇", "🥈", "🥉"][i]}</span>
                <span>{p.rank}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="type-text-sm text-muted-foreground flex flex-col gap-1">
                {p.items.map((it) => (
                  <li key={it}>• {it}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="type-text-sm text-muted-foreground text-center">
        🎁 Everyone who submits gets a goodie.
      </p>
    </>
  );
}

function RulesPanel() {
  return (
    <>
      <PanelHeader icon={<ShieldCheck className="size-8" />} title="Submission rules" subtitle="What to submit" />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>🎬 Video demo</CardTitle></CardHeader>
          <CardContent>
            <p className="type-text-sm text-muted-foreground">
              A short video showing your GPT App in action.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>💻 GitHub repo</CardTitle></CardHeader>
          <CardContent>
            <p className="type-text-sm text-muted-foreground">
              Public or private repo with your code and a README.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>👥 Team info</CardTitle></CardHeader>
          <CardContent>
            <p className="type-text-sm text-muted-foreground">
              Team name and all members' email addresses.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>⏰ Deadline</CardTitle></CardHeader>
          <CardContent>
            <p className="type-text-sm text-muted-foreground">
              Submissions stay open until Sunday May 31 at 23:59. You have the
              whole weekend to polish.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function JudgingPanel() {
  return (
    <>
      <PanelHeader icon={<ShieldCheck className="size-8" />} title="Judging" subtitle="Async — take your time" />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>🗓 Async evaluation</CardTitle></CardHeader>
          <CardContent>
            <p className="type-text-sm text-muted-foreground">
              No live judging on the night. You have the whole weekend — from now
              until Sunday May 31 at 23:59 — to submit and polish.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>🏅 Winners announcement</CardTitle></CardHeader>
          <CardContent>
            <p className="type-text-sm text-muted-foreground">
              Judges review submissions the following week. Winners are
              announced after that.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>📋 Criteria</CardTitle></CardHeader>
          <CardContent>
            <p className="type-text-sm text-muted-foreground">
              Detailed criteria coming soon — but expect a mix of usefulness,
              technical execution, and the conversational MCP-native experience.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>📬 Submit</CardTitle></CardHeader>
          <CardContent>
            <p className="type-text-sm text-muted-foreground">
              Ask me to <em className="text-primary not-italic">"submit my project"</em>{" "}
              when you're ready.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function FormatPanel() {
  return (
    <>
      <PanelHeader icon={<Users className="size-8" />} title="Co-op mode" subtitle="Fly solo or pick a partner" />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>🧍 1 player</CardTitle></CardHeader>
          <CardContent>
            <p className="type-text-sm text-muted-foreground">
              Build alone. Pure focus, all the credit.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>🧑‍🤝‍🧑 2 players</CardTitle></CardHeader>
          <CardContent>
            <p className="type-text-sm text-muted-foreground">
              Team up with one partner. Max two per team.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function UnknownPanel({ topic }: { topic?: string }) {
  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Topic not found</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="type-text-sm text-muted-foreground">
          {topic ? <>I don't have a panel for <em className="text-foreground">"{topic}"</em>.</> : <>No topic provided.</>}
        </p>
        <div className="flex flex-wrap gap-2">
          {["schedule", "venue", "prizes", "rules", "mission", "format"].map((t) => (
            <Badge key={t} variant="secondary">{t}</Badge>
          ))}
        </div>
        <p className="type-text-xs text-muted-foreground">
          Try asking about one of these.
        </p>
      </CardContent>
    </Card>
  );
}

export default function TellMeAbout() {
  const { theme } = useLayout();
  const info = useToolInfo<{ input: { topic?: string } }>();
  const raw = info.input?.topic;
  const topic = resolveTopic(raw);

  return (
    <Shell theme={theme}>
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-10">
        {topic === "mission" && <MissionPanel />}
        {topic === "schedule" && <SchedulePanel />}
        {topic === "venue" && <VenuePanel />}
        {topic === "prizes" && <PrizesPanel />}
        {topic === "rules" && <RulesPanel />}
        {topic === "judging" && <JudgingPanel />}
        {topic === "format" && <FormatPanel />}
        {topic === "unknown" && <UnknownPanel topic={raw} />}
      </div>
    </Shell>
  );
}
