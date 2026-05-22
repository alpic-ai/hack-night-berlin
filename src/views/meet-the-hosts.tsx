import "@/index.css";

import { useLayout } from "skybridge/web";
import { Avatar, AvatarFallback, AvatarImage } from "@alpic-ai/ui/components/avatar";
import { Card, CardContent } from "@alpic-ai/ui/components/card";
import { Linkedin } from "lucide-react";

import { Shell } from "./components/shell.js";

// Drop photo files (jpg/png) into public/hosts/{nikolay,punit,igor}.jpg
// and they'll auto-appear. Until then, Avatar falls back to initials.
const HOSTS = [
  {
    name: "Nikolay",
    role: "Co-founder",
    company: "Alpic",
    initials: "NR",
    photo: "/hosts/nikolay.png",
    url: "https://www.linkedin.com/in/nikolayrodionov/?locale=en",
  },
  {
    name: "Punit",
    role: "Host",
    company: "Handpicked Berlin",
    initials: "PT",
    photo: "/hosts/punit.png",
    url: "https://www.linkedin.com/in/punitvthakkar/",
  },
  {
    name: "Igor",
    role: "Host",
    company: "Handpicked Berlin",
    initials: "IR",
    photo: "/hosts/igor.jpeg",
    url: "https://www.linkedin.com/in/igor-ranc/",
  },
];

export default function MeetTheHosts() {
  const { theme } = useLayout();
  return (
    <Shell theme={theme}>
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10">
        <header className="flex flex-col items-center gap-2 text-center">
          <h2 className="type-display-sm font-bold">Your hosts</h2>
          <p className="type-text-sm text-muted-foreground">
            Handpicked Berlin × Alpic
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {HOSTS.map((h) => (
            <a
              key={h.name}
              href={h.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card hoverable className="h-full">
                <CardContent className="flex flex-col items-center gap-3 text-center">
                  <Avatar className="size-24">
                    <AvatarImage src={h.photo} alt={h.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground type-display-xs font-semibold">
                      {h.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <p className="type-text-lg font-semibold">{h.name}</p>
                    <p className="type-text-sm text-muted-foreground">{h.role}</p>
                    <p className="type-text-xs text-primary">{h.company}</p>
                  </div>
                  <Linkedin className="text-muted-foreground group-hover:text-primary size-4 transition-colors" />
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </Shell>
  );
}
