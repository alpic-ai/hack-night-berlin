import { useEffect, useRef, useState } from "react";
import { useRequestClose } from "skybridge/web";
import { Badge } from "@alpic-ai/ui/components/badge";
import { Button } from "@alpic-ai/ui/components/button";
import { Card, CardContent } from "@alpic-ai/ui/components/card";
import { cn } from "@alpic-ai/ui/lib/cn";
import { Timer, X } from "lucide-react";

type Item = { id: string; label: string; emoji: string; tooltip: string };

const ITEMS: Item[] = [
  { id: "sterni", label: "Sterni", emoji: "🍺", tooltip: "Sternburger Pilsner — Berlin's cheapest beer" },
  { id: "mate", label: "Mate", emoji: "🧉", tooltip: "Club-Mate — caffeinated icon of Berlin" },
  { id: "schrippe", label: "Schrippe", emoji: "🥖", tooltip: "Bread roll" },
  { id: "currywurst", label: "Currywurst", emoji: "🌭", tooltip: "Sausage. Curry. Berlin." },
  { id: "doner", label: "Döner", emoji: "🥙", tooltip: "The Berlin kebab" },
  { id: "zigaretten", label: "Cigarettes", emoji: "🚬", tooltip: "Zigaretten" },
  { id: "feuerzeug", label: "Lighter", emoji: "🔥", tooltip: "Feuerzeug" },
  { id: "brezel", label: "Pretzel", emoji: "🥨", tooltip: "Brezel" },
  { id: "gurke", label: "Pickle", emoji: "🥒", tooltip: "Saure Gurke" },
];

type Order = { want: Record<string, number>; line: string };

const ORDERS_BY_TIER: Record<1 | 2 | 3, Order[]> = {
  1: [
    { want: { sterni: 1 }, line: "One Sterni." },
    { want: { mate: 1 }, line: "One Mate, please." },
    { want: { brezel: 1 }, line: "One pretzel, bitte." },
    { want: { sterni: 1, mate: 1 }, line: "One Sterni, one Mate. Schnell!" },
    { want: { zigaretten: 1, feuerzeug: 1 }, line: "Cigarettes and a lighter." },
    { want: { currywurst: 1, schrippe: 1 }, line: "Currywurst with a Schrippe." },
  ],
  2: [
    { want: { currywurst: 2, schrippe: 1 }, line: "Two Currywurst and a bread roll, bitte!" },
    { want: { doner: 1, mate: 1 }, line: "Döner — no salad. And a Mate!" },
    { want: { sterni: 2, mate: 1 }, line: "Two Sternis and a Mate. Schnell!" },
    { want: { brezel: 2, gurke: 1 }, line: "Two pretzels and a pickle." },
    { want: { mate: 2, zigaretten: 1 }, line: "Two Mates and cigarettes." },
    { want: { sterni: 3 }, line: "THREE Sternis for the park. Quick!" },
    { want: { doner: 1, brezel: 1 }, line: "A Döner and a pretzel." },
    { want: { mate: 1, schrippe: 2 }, line: "One Mate, two Schrippen." },
  ],
  3: [
    { want: { sterni: 3, mate: 2 }, line: "THREE Sternis and TWO Mates. Bewegung!" },
    { want: { currywurst: 1, sterni: 1, schrippe: 1, gurke: 1 }, line: "Currywurst, Sterni, Schrippe, and a pickle. Go go go!" },
    { want: { doner: 2, brezel: 1, mate: 1 }, line: "Two Döners, a pretzel, and a Mate — chop chop!" },
    { want: { sterni: 4 }, line: "FOUR Sternis. Don't drop them." },
    { want: { zigaretten: 2, feuerzeug: 1, mate: 1 }, line: "Two packs of cigarettes, a lighter, and a Mate." },
    { want: { currywurst: 2, brezel: 1, sterni: 1, gurke: 1 }, line: "Two Currywurst, a Brezel, a Sterni, and a Gurke. SCHNELL!" },
    { want: { sterni: 2, mate: 2, brezel: 1 }, line: "Two Sternis, two Mates, a pretzel. Move!" },
    { want: { doner: 1, currywurst: 1, sterni: 1, mate: 1 }, line: "Döner, Currywurst, Sterni, Mate. Eile!" },
  ],
};

const TIER_LENGTHS = { 1: 3, 2: 6, 3: 10 } as const;
const TIER_PASS_RATIO = 2 / 3; // need 2/3 of tier max to advance
const ROUND_MS = 8000;
const TICK_MS = 100;

type Phase = "idle" | "playing" | "result" | "checkpoint" | "done";
type Tier = 1 | 2 | 3;

const TIER_META: Record<Tier, { label: string; symbol: string; bg: string; textColor: string; word: string }> = {
  1: { label: "Green",  symbol: "●", bg: "bg-emerald-500",  textColor: "text-white", word: "Green slope" },
  2: { label: "Blue",   symbol: "■", bg: "bg-sky-500",      textColor: "text-white", word: "Blue slope" },
  3: { label: "Black",  symbol: "◆", bg: "bg-black",        textColor: "text-white", word: "Black diamond" },
};

const VERDICTS = {
  perfect: [
    "Ja! Perfect order.",
    "Sehr gut! Spot on.",
    "Genau! That's the one.",
    "Wunderbar! Take it.",
    "Bingo! Hier, bitte.",
    "Stimmt! Nailed it.",
  ],
  partial: [
    "Naja… half-right.",
    "Fast! Almost there.",
    "Halb gut. Try harder.",
    "Hmm. Knapp daneben.",
    "Eh… close, not quite.",
  ],
  wrong: [
    "Nein! Try again, Schätzchen.",
    "Falsch! Move it.",
    "Was?! That's not it.",
    "Quatsch! No way.",
    "Hä?! Read the order again.",
  ],
} as const;

function pickVerdict(kind: keyof typeof VERDICTS): string {
  return VERDICTS[kind][Math.floor(Math.random() * VERDICTS[kind].length)];
}

function eq(a: Record<string, number>, b: Record<string, number>) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) if ((a[k] ?? 0) !== (b[k] ?? 0)) return false;
  return true;
}

function partial(want: Record<string, number>, got: Record<string, number>) {
  for (const [k, v] of Object.entries(want)) if (got[k] === v) return true;
  return false;
}

function tierMax(t: Tier) {
  return TIER_LENGTHS[t] * 3;
}

function shuffle<T>(arr: T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pickOrder(tier: Tier): Order {
  const pool = ORDERS_BY_TIER[tier];
  return pool[Math.floor(Math.random() * pool.length)];
}

type TierResult = { tier: Tier; score: number; passed: boolean };

export default function SpatiShowdown() {
  const requestClose = useRequestClose();

  const [phase, setPhase] = useState<Phase>("idle");
  const [tier, setTier] = useState<Tier>(1);
  const [roundInTier, setRoundInTier] = useState(0);
  const [order, setOrder] = useState<Order>(() => pickOrder(1));
  const [shelf, setShelf] = useState<Item[]>(ITEMS);
  const [basket, setBasket] = useState<Record<string, number>>({});
  const [tierScore, setTierScore] = useState(0);
  const [history, setHistory] = useState<TierResult[]>([]);
  const [timeLeft, setTimeLeft] = useState(ROUND_MS);
  const [verdict, setVerdict] = useState<string | null>(null);

  const basketRef = useRef(basket);
  basketRef.current = basket;
  const orderRef = useRef(order);
  orderRef.current = order;
  const tierRef = useRef(tier);
  tierRef.current = tier;
  const roundInTierRef = useRef(roundInTier);
  roundInTierRef.current = roundInTier;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  function startGame() {
    setTier(1);
    setRoundInTier(0);
    setOrder(pickOrder(1));
    setShelf(shuffle(ITEMS));
    setBasket({});
    setVerdict(null);
    setTierScore(0);
    setHistory([]);
    setTimeLeft(ROUND_MS);
    setPhase("playing");
  }

  function startTier(t: Tier) {
    setTier(t);
    setRoundInTier(0);
    setOrder(pickOrder(t));
    setShelf(shuffle(ITEMS));
    setBasket({});
    setVerdict(null);
    setTierScore(0);
    setTimeLeft(ROUND_MS);
    setPhase("playing");
  }

  function deliver() {
    if (phaseRef.current !== "playing") return;
    const want = orderRef.current.want;
    const got = basketRef.current;
    let points = 0;
    let kind: keyof typeof VERDICTS = "wrong";
    if (eq(want, got)) {
      points = 3;
      kind = "perfect";
    } else if (partial(want, got)) {
      points = 1;
      kind = "partial";
    }
    const updatedTierScore = tierScore + points;
    setTierScore(updatedTierScore);
    setVerdict(pickVerdict(kind));
    setPhase("result");
    setTimeout(() => {
      const nextRoundInTier = roundInTierRef.current + 1;
      const currentTier = tierRef.current;
      if (nextRoundInTier >= TIER_LENGTHS[currentTier]) {
        // Tier complete — go to checkpoint
        const passed = updatedTierScore >= tierMax(currentTier) * TIER_PASS_RATIO;
        setHistory((h) => [...h, { tier: currentTier, score: updatedTierScore, passed }]);
        setPhase("checkpoint");
      } else {
        setRoundInTier(nextRoundInTier);
        setOrder(pickOrder(currentTier));
        setShelf(shuffle(ITEMS));
        setBasket({});
        setVerdict(null);
        setTimeLeft(ROUND_MS);
        setPhase("playing");
      }
    }, 1400);
  }

  useEffect(() => {
    if (phase !== "playing") return;
    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= TICK_MS) {
          queueMicrotask(() => deliver());
          return 0;
        }
        return t - TICK_MS;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [phase, roundInTier]);

  const tMeta = TIER_META[tier];
  const totalScore = history.reduce((s, h) => s + h.score, 0) + (phase === "playing" || phase === "result" ? tierScore : 0);
  const totalMax = tierMax(1) + tierMax(2) + tierMax(3);

  function CloseButton() {
    return (
      <button
        type="button"
        aria-label="Close game"
        onClick={() => requestClose()}
        className="absolute right-3 top-3 z-10 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <X className="size-4" />
      </button>
    );
  }

  return (
    <Card className="relative mx-auto max-w-2xl">
      <CloseButton />
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-1">
          <h2 className="type-display-xs font-bold text-primary">Späti Showdown</h2>
          <p className="type-text-sm text-muted-foreground">
            Berlin's fastest corner shop — don't fumble the order
          </p>
        </div>

        {phase === "idle" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="type-text-md text-foreground max-w-md">
              Pass each slope to unlock the next. Three slopes, 8 seconds per
              order, shelf shuffles every round.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <span className="inline-flex items-center gap-1.5">
                <span className="text-emerald-500 text-lg">●</span> Green · {TIER_LENGTHS[1]}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="text-sky-500 text-lg">■</span> Blue · {TIER_LENGTHS[2]}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="text-foreground text-lg">◆</span> Black · {TIER_LENGTHS[3]}
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => requestClose()}>
                Exit
              </Button>
              <Button variant="primary" onClick={startGame}>
                Start
              </Button>
            </div>
          </div>
        )}

        {(phase === "playing" || phase === "result") && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge variant="secondary">
                {roundInTier + 1} / {TIER_LENGTHS[tier]}
              </Badge>
              <Badge
                variant="primary"
                className={cn("gap-1.5", tMeta.bg, tMeta.textColor, "border-transparent")}
              >
                <span>{tMeta.symbol}</span>
                {tMeta.label}
              </Badge>
              <Badge variant="secondary">Tier {tierScore} pts</Badge>
              <Badge
                variant="secondary"
                className={cn(
                  "gap-1",
                  timeLeft < 2000 && "bg-destructive text-destructive-foreground border-transparent animate-pulse",
                )}
              >
                <Timer className="size-3" />
                {(timeLeft / 1000).toFixed(1)}s
              </Badge>
            </div>

            <div className="flex justify-center">
              <div className="bg-muted text-foreground type-text-md rounded-lg px-4 py-3 max-w-md text-center font-medium">
                {order.line}
              </div>
            </div>

            <div className="border-border bg-muted/30 flex min-h-12 flex-wrap items-center gap-2 rounded-md border border-dashed p-3">
              <span className="type-text-xs text-muted-foreground uppercase tracking-wider">
                Basket
              </span>
              {Object.entries(basket).length === 0 ? (
                <span className="type-text-sm text-muted-foreground italic">empty</span>
              ) : (
                Object.entries(basket).map(([id, n]) => {
                  const it = ITEMS.find((i) => i.id === id)!;
                  return (
                    <Badge key={id} variant="primary">
                      {it.emoji} {it.label} ×{n}
                    </Badge>
                  );
                })
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {shelf.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  title={it.tooltip}
                  disabled={phase !== "playing"}
                  onClick={() =>
                    setBasket((b) => ({ ...b, [it.id]: (b[it.id] ?? 0) + 1 }))
                  }
                  className={cn(
                    "border-border bg-background hover:border-primary hover:bg-primary/5",
                    "flex flex-col items-center gap-1 rounded-md border p-3 transition-colors",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                  )}
                >
                  <span className="text-2xl leading-none">{it.emoji}</span>
                  <span className="type-text-xs font-medium">{it.label}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-2">
              <Button
                variant="secondary"
                disabled={phase !== "playing"}
                onClick={() => setBasket({})}
              >
                Clear
              </Button>
              <Button
                variant="primary"
                disabled={phase !== "playing"}
                onClick={() => deliver()}
              >
                Deliver
              </Button>
            </div>

            {phase === "result" && verdict && (
              <p className="text-primary type-display-xs text-center font-bold">{verdict}</p>
            )}
          </div>
        )}

        {phase === "checkpoint" && (() => {
          const last = history[history.length - 1];
          if (!last) return null;
          const max = tierMax(last.tier);
          const passed = last.passed;
          const isLastTier = last.tier === 3;
          const nextTier = (last.tier + 1) as Tier;

          return (
            <div className="flex flex-col items-center gap-5 text-center">
              <div
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
                  TIER_META[last.tier].bg,
                  TIER_META[last.tier].textColor,
                )}
              >
                <span>{TIER_META[last.tier].symbol}</span>
                <span className="font-semibold">{TIER_META[last.tier].word}</span>
              </div>

              <h3 className="type-display-sm font-bold">
                {passed ? "Slope cleared!" : "Wiped out."}
              </h3>

              <p className="type-text-md text-muted-foreground max-w-md">
                You scored <span className="text-foreground font-semibold">{last.score}</span> out of{" "}
                <span className="text-foreground font-semibold">{max}</span> on the{" "}
                {TIER_META[last.tier].word.toLowerCase()}.
                {passed
                  ? isLastTier
                    ? " You made it down the mountain."
                    : ` Ready for the ${TIER_META[nextTier].word.toLowerCase()}?`
                  : ` You needed ${Math.ceil(max * TIER_PASS_RATIO)} to pass. Retry it.`}
              </p>

              {/* Per-tier history badges */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {history.map((h) => (
                  <Badge
                    key={h.tier}
                    variant="secondary"
                    className={cn(
                      "gap-1.5",
                      h.passed
                        ? `${TIER_META[h.tier].bg} ${TIER_META[h.tier].textColor} border-transparent`
                        : "bg-muted text-muted-foreground line-through",
                    )}
                  >
                    {TIER_META[h.tier].symbol} {h.score}/{tierMax(h.tier)}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                <Button variant="secondary" onClick={() => requestClose()}>
                  Exit
                </Button>
                {!passed && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      // remove the just-failed tier result so retry replaces it
                      setHistory((h) => h.slice(0, -1));
                      startTier(last.tier);
                    }}
                  >
                    Retry slope
                  </Button>
                )}
                {passed && !isLastTier && (
                  <Button variant="primary" onClick={() => startTier(nextTier)}>
                    Continue → {TIER_META[nextTier].word}
                  </Button>
                )}
                {passed && isLastTier && (
                  <Button variant="primary" onClick={() => setPhase("done")}>
                    See recap
                  </Button>
                )}
              </div>
            </div>
          );
        })()}

        {phase === "done" && (
          <div className="flex flex-col items-center gap-5 text-center">
            <h3 className="type-display-sm text-primary font-bold">Recap</h3>

            <div className="flex flex-col items-stretch gap-2 w-full max-w-sm">
              {history.map((h) => (
                <div
                  key={h.tier}
                  className="flex items-center justify-between gap-3 rounded-md border border-border p-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex size-8 items-center justify-center rounded-full",
                        TIER_META[h.tier].bg,
                        TIER_META[h.tier].textColor,
                      )}
                    >
                      {TIER_META[h.tier].symbol}
                    </span>
                    <span className="type-text-md font-medium">
                      {TIER_META[h.tier].word}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="type-text-md font-semibold">
                      {h.score}/{tierMax(h.tier)}
                    </span>
                    <Badge variant={h.passed ? "primary" : "secondary"}>
                      {h.passed ? "Passed" : "Wiped"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-border w-full max-w-sm border-t pt-3">
              <p className="type-display-xs text-primary font-bold">
                Total: {totalScore} / {totalMax}
              </p>
              <p className="type-text-md text-muted-foreground mt-1">
                {totalScore >= totalMax - 10
                  ? "Echt Berliner. The owner respects you."
                  : totalScore >= totalMax / 2
                    ? "Not bad. Come back tomorrow."
                    : "Tourist. Try again — schneller this time."}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => requestClose()}>
                Exit
              </Button>
              <Button variant="primary" onClick={startGame}>
                Play again
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
