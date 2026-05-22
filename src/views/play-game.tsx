import "@/index.css";

import { useLayout } from "skybridge/web";

import { Shell } from "./components/shell.js";
import SpatiShowdown from "./components/spati-showdown.js";

export default function PlayGame() {
  const { theme } = useLayout();
  return (
    <Shell theme={theme}>
      <div className="px-4 py-8 md:py-12">
        <SpatiShowdown />
      </div>
    </Shell>
  );
}
