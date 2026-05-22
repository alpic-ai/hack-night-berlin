import "@/index.css";

import { useState } from "react";
import { useLayout, useSendFollowUpMessage } from "skybridge/web";
import { Card, CardContent, CardHeader, CardTitle } from "@alpic-ai/ui/components/card";
import { Gamepad2, MapPin, Sparkles } from "lucide-react";

import alpicPeak from "./images/alpic-peak.svg";
import { Chairlift } from "./components/chairlift.js";
import { Snowflakes } from "./components/mountains.js";
import { Shell } from "./components/shell.js";

type Capability = {
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
  prompt: string;
};

const CAPABILITIES: Capability[] = [
  {
    icon: <Gamepad2 className="size-5" />,
    title: "Distract me",
    body: (
      <>
        Waiting for your agent to finish? I'll launch{" "}
        <span className="font-medium text-foreground">Späti Showdown</span> —
        a fast Berlin corner-shop rush.
      </>
    ),
    prompt: "I'm bored, play a game",
  },
  {
    icon: <MapPin className="size-5" />,
    title: "Event info",
    body: <>Venue, schedule, prizes, hosts — ask in your own words.</>,
    prompt: "What time does it start?",
  },
  {
    icon: <Sparkles className="size-5" />,
    title: "Resources",
    body: (
      <>
        Skybridge docs and the GitHub repo — everything you need to start
        building.
      </>
    ),
    prompt: "Where do I start?",
  },
];

export default function Welcome() {
  const { theme } = useLayout();
  const [started, setStarted] = useState(false);
  const sendFollowUp = useSendFollowUpMessage();

  if (!started) {
    return (
      <Shell theme={theme} mountains="none">
        <div
          className="relative min-h-[640px] cursor-pointer select-none outline-none overflow-hidden bg-zinc-950"
          onClick={() => setStarted(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setStarted(true);
          }}
          role="button"
          tabIndex={0}
          aria-label="Press start"
        >
          {/* Mountain background — blurred + dimmed so text reads */}
          <img
            src="/alpic-mountain.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-bottom opacity-60"
            style={{ filter: "blur(8px) brightness(0.55) saturate(1.1)" }}
          />
          {/* Vignette + dark overlay for legibility */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-950/85 via-zinc-950/40 to-zinc-950/90" />
          <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.55)_100%)]" />

          <Chairlift />
          <Snowflakes count={20} />

          <div className="relative z-10 flex min-h-[640px] flex-col items-center justify-center gap-6 px-6 py-20">
            <div className="text-center">
              <p className="type-text-sm text-white/80 tracking-[0.3em]">
                HANDPICKED BERLIN × ALPIC
              </p>
              <p className="type-text-sm text-white/60 tracking-[0.4em]">PRESENT</p>
            </div>
            <h1 className="type-display-2xl font-bold text-primary animate-pulse tracking-tight text-center drop-shadow-[0_6px_32px_rgba(0,0,0,0.7)]">
              PRESS START
            </h1>
            <p className="type-text-sm text-white/60">Click anywhere to begin</p>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell theme={theme} mountains="none">
      <div className="relative overflow-hidden">
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col gap-8 px-6 py-10">
          <header className="flex flex-col items-center gap-4 text-center">
            <img
              src={alpicPeak}
              alt=""
              aria-hidden="true"
              className="h-14 w-auto"
            />
            <h1 className="type-display-xl font-bold tracking-tight">
              Berlin <span className="text-primary">Hack Night</span>
            </h1>
            <p className="type-text-md text-muted-foreground">
              'Build a GPT App' · May 28, 2026 · Berlin · 18:00–22:00 · Free
            </p>
          </header>

          <div className="grid gap-4 md:grid-cols-3">
            {CAPABILITIES.map((cap) => (
              <Card
                key={cap.title}
                hoverable
                role="button"
                tabIndex={0}
                onClick={() => sendFollowUp(cap.prompt)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    sendFollowUp(cap.prompt);
                  }
                }}
                className="cursor-pointer focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 outline-none"
              >
                <CardHeader>
                  <div className="flex items-center gap-2 text-primary">
                    {cap.icon}
                    <CardTitle>{cap.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <p className="type-text-sm text-muted-foreground">{cap.body}</p>
                  <p className="type-text-xs text-muted-foreground border-t pt-3">
                    Click to ask:{" "}
                    <em className="text-primary not-italic">"{cap.prompt}"</em>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
