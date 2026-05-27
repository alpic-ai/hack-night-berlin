import { McpServer } from "skybridge/server";
import { z } from "zod";

const CSP = {
  resourceDomains: [
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
  ],
  redirectDomains: [
    "https://www.linkedin.com",
    "https://github.com",
    "https://docs.skybridge.tech",
  ],
};

const server = new McpServer(
  {
    name: "Berlin Hack Night",
    version: "0.0.1",
  },
  { capabilities: {} },
)
  .registerTool(
    {
      name: "welcome",
      description:
        "Open the Berlin Hack Night welcome screen. Use when the user opens the app, says hi, asks 'what is this?', 'start', or 'show me what you can do'. The view itself explains everything — you do NOT need to list capabilities in chat.",
      inputSchema: {},
      view: { component: "welcome", description: "Welcome screen with PRESS START + capability cards.", csp: CSP },
    },
    async () => ({
      structuredContent: {},
      content: [
        {
          type: "text",
          text:
            "Welcome screen opened. The view shows the user everything they can do. " +
            "Keep your reply very short — one sentence. Tell them you're their hack-night companion and to press START to see the options. " +
            "Do NOT list capabilities, do NOT describe tools — the view already does that. " +
            "BACKGROUND CONTEXT for later turns: " +
            "(a) Judging is async — submissions are open from now until Sunday May 31 at 23:59, judges review the following week, winners announced after. " +
            "(b) When the user asks anything about Skybridge or Alpic docs, use the ask_skybridge tool to fetch the official docs.",
        },
      ],
      isError: false,
    }),
  )
  .registerTool(
    {
      name: "play_game",
      description:
        "Launch the Späti Showdown mini-game — a fast Berlin corner-shop rush. 5 rounds, 8 seconds each. Use when the user wants to be distracted while their coding agent works, asks for a game, says they're bored, or asks 'can you entertain me'. The user plays directly in the view.",
      inputSchema: {},
      view: { component: "play-game", description: "Späti Showdown mini-game.", csp: CSP },
    },
    async () => ({
      structuredContent: {},
      content: [
        { type: "text", text: "Game launched. Tell the user to press START in the view. One sentence." },
      ],
      isError: false,
    }),
  )
  .registerTool(
    {
      name: "tell_me_about",
      description:
        "Show an info panel about a Berlin Hack Night topic. Use when the user asks about the event — schedule, agenda, venue, location, prizes, rules, submission requirements, mission, format, co-op vs solo. Pass the topic in natural language.",
      inputSchema: {
        topic: z
          .string()
          .describe(
            "What the user wants to know about. Free text — e.g. 'schedule', 'where is it', 'how do I submit', 'prizes', 'mission'.",
          ),
      },
      view: { component: "tell-me-about", description: "Topic info panel.", csp: CSP },
    },
    async ({ topic }) => ({
      structuredContent: { topic },
      content: [
        {
          type: "text",
          text:
            `Showing info about: ${topic}. Keep your reply short — the panel has the details. ` +
            "Reminder: judging is async — the user has from now until Sunday May 31 at 23:59 to submit; winners announced the following week.",
        },
      ],
      isError: false,
    }),
  )
  .registerTool(
    {
      name: "list_resources",
      description:
        "Show the full list of resources for building a GPT App — Skybridge repo and docs. Use when the user asks 'what resources are there?', 'show me the docs', or wants an overview. For a single specific resource (or 'where do I start?'), use get_resource instead.",
      inputSchema: {},
      view: { component: "list-resources", description: "All resources.", csp: CSP },
    },
    async () => ({
      structuredContent: {},
      content: [{ type: "text", text: "Resources shown. Keep your reply short." }],
      isError: false,
    }),
  )
  .registerTool(
    {
      name: "get_resource",
      description:
        "Open a single specific resource by name or topic. Use this whenever the user wants to jump directly to one resource — especially for 'where do I start?', 'how do I begin?', 'quickstart', or 'create an app' (→ Skybridge quickstart). Other matches: 'docs' / 'documentation' → Skybridge Docs; 'repo' / 'github' / 'skybridge' → Skybridge repo.",
      inputSchema: {
        name: z
          .string()
          .describe(
            "Resource keyword. Examples: 'start' / 'where do I start' / 'quickstart' / 'create', 'docs', 'skybridge', 'repo'.",
          ),
      },
      view: { component: "get-resource", description: "Single resource detail.", csp: CSP },
    },
    async ({ name }) => ({
      structuredContent: { name },
      content: [{ type: "text", text: `Opening resource: ${name}. Keep your reply short.` }],
      isError: false,
    }),
  )
  .registerTool(
    {
      name: "meet_the_hosts",
      description:
        "Show the host cards — Nikolay (Alpic), Punit (Handpicked Berlin), Igor (Handpicked Berlin). Use when the user asks 'who's running this', 'who are the hosts', 'who organized this'.",
      inputSchema: {},
      view: { component: "meet-the-hosts", description: "Host cards.", csp: CSP },
    },
    async () => ({
      structuredContent: {},
      content: [{ type: "text", text: "Host cards shown. Keep your reply short." }],
      isError: false,
    }),
  )
  .registerTool(
    {
      name: "ask_skybridge",
      description:
        "Answer ANY question about Skybridge (the open-source framework this app uses) or Alpic docs. Fetches docs.skybridge.tech and returns relevant content. Use this whenever the user asks anything about Skybridge — APIs, hooks, registerTool, views, useViewState, useToolInfo, useCallTool, mountView, deployment, the CLI, examples. Pass the user's question verbatim.",
      inputSchema: {
        question: z.string().describe("The user's Skybridge / Alpic docs question, in their own words."),
      },
    },
    async ({ question }) => {
      const ua = { "User-Agent": "BerlinHackNight/0.0.1" };
      let index = "";
      try {
        const res = await fetch("https://docs.skybridge.tech/llms.txt", { headers: ua });
        if (res.ok) index = await res.text();
      } catch {}

      const q = question.toLowerCase();
      const qWords = q.split(/\W+/).filter((w) => w.length > 3);
      let bestUrl: string | null = null;
      let bestTitle = "";
      let bestScore = 0;
      for (const line of index.split("\n")) {
        const m = line.match(
          /\[(.+?)\]\((https?:\/\/docs\.skybridge\.tech\/[^)]+\.md)\)(.*)/,
        );
        if (!m) continue;
        const [, title, url, rest] = m;
        const haystack = (title + " " + rest).toLowerCase();
        let score = 0;
        for (const w of qWords) if (haystack.includes(w)) score++;
        if (score > bestScore) {
          bestScore = score;
          bestUrl = url;
          bestTitle = title;
        }
      }

      let pageContent = "";
      if (bestUrl) {
        try {
          const res = await fetch(bestUrl, { headers: ua });
          if (res.ok) pageContent = await res.text();
        } catch {}
      }

      const sections: string[] = [
        `User's Skybridge question: "${question}"`,
        "",
        "Source: official docs at https://docs.skybridge.tech",
        "",
        "## Docs index (llms.txt)",
        index || "(index unavailable — fall back to suggesting https://docs.skybridge.tech)",
      ];
      if (pageContent && bestUrl) {
        sections.push(
          "",
          `## Best-matching page: ${bestTitle}`,
          `URL: ${bestUrl}`,
          "",
          pageContent.slice(0, 8000),
        );
      }
      sections.push(
        "",
        "---",
        "INSTRUCTIONS for your reply:",
        "1. Answer the user's question concisely using the docs content above.",
        "2. Cite the doc URL you used.",
        "3. ALSO append: \"By the way — to use this app interactively (not just here in the Skybridge playground), install it in ChatGPT Developer Mode. See https://docs.skybridge.tech for setup.\" — but only mention this once per conversation, on the first Skybridge question.",
      );

      return {
        structuredContent: {
          question,
          matchedUrl: bestUrl,
        },
        content: [{ type: "text", text: sections.join("\n") }],
        isError: false,
      };
    },
  )
  .registerTool(
    {
      name: "submit_project",
      description:
        "Open the submission form for the user's GPT App. Use when the user wants to submit their build, says 'I'm done', 'I want to submit', 'how do I submit'. Pre-fill any fields you already know from the conversation (team name, repo URL, video URL, mcp app URL, emails).",
      inputSchema: {
        team_name: z.string().optional().describe("Team or solo player name."),
        emails: z.string().optional().describe("Comma-separated team member emails."),
        repo_url: z.string().optional().describe("GitHub repo URL (public or private)."),
        video_url: z.string().optional().describe("Video demo URL."),
        mcp_url: z.string().optional().describe("Live MCP App / GPT App URL (the deployed app endpoint)."),
        notes: z.string().optional().describe("Optional notes for the judges."),
      },
      view: { component: "submit-project", description: "Submission form.", csp: CSP },
    },
    async ({ team_name, emails, repo_url, video_url, mcp_url, notes }) => {
      const hasAll =
        Boolean(team_name) &&
        Boolean(emails) &&
        Boolean(repo_url) &&
        Boolean(video_url) &&
        Boolean(mcp_url);

      if (hasAll && process.env.SUBMISSIONS_WEBHOOK_URL) {
        try {
          // Apps Script Web App requires form-encoded POSTs and uses a 302
          // redirect from script.google.com to script.googleusercontent.com.
          // Node's fetch downgrades POST→GET on 302, so we follow manually.
          const body = new URLSearchParams({
            team_name: team_name!,
            emails: emails!,
            repo_url: repo_url!,
            video_url: video_url!,
            mcp_url: mcp_url!,
            notes: notes ?? "",
            submitted_at: new Date().toISOString(),
          }).toString();

          let url: string | null = process.env.SUBMISSIONS_WEBHOOK_URL;
          let cookies = "";
          for (let hops = 0; hops < 5 && url; hops++) {
            const headers: Record<string, string> = {
              "Content-Type": "application/x-www-form-urlencoded",
              "User-Agent":
                "Mozilla/5.0 (compatible; BerlinHackNight/0.0.1; +https://hack-night-berlin-703abf80.alpic.live)",
            };
            if (cookies) headers["Cookie"] = cookies;
            const res: Response = await fetch(url, {
              method: "POST",
              headers,
              body,
              redirect: "manual",
            });
            // Accumulate cookies across the redirect chain
            const setCookie = res.headers.getSetCookie?.() ?? [];
            for (const sc of setCookie) {
              const pair = sc.split(";")[0];
              if (pair) cookies = cookies ? `${cookies}; ${pair}` : pair;
            }
            if (res.status >= 300 && res.status < 400) {
              url = res.headers.get("location");
              continue;
            }
            if (!res.ok) {
              console.error(
                `Submission webhook returned ${res.status}: ${(await res.text()).slice(0, 200)}`,
              );
            }
            break;
          }
        } catch (err) {
          console.error("Failed to post submission to webhook:", err);
        }
      }

      return {
        structuredContent: {
          ok: hasAll,
          message: hasAll ? "Submission received." : "Submission opened; awaiting fields.",
        },
        content: [
          {
            type: "text",
            text: hasAll
              ? `Submission received from ${team_name}. Confirm briefly in one sentence.`
              : "Submission form opened. Tell the user briefly in one sentence to fill it in.",
          },
        ],
        isError: false,
      };
    },
  );

if (process.env.NODE_ENV === "production") {
  const { default: manifest } = await import("./vite-manifest.js");
  server.setViteManifest(manifest);
}

export default await server.run();

export type AppType = typeof server;
