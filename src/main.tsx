import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n"; // Initialize i18n for multi-language support
import { capturePrerenderSnapshot } from "./lib/prerenderSnapshot";

const container = document.getElementById("root")!;

// Snapshot the prerendered route markup BEFORE createRoot() discards it, so
// App's initial Suspense fallback can show the real page instead of a spinner
// while the route chunk loads. See src/lib/prerenderSnapshot.ts for why this
// matters to Google (Soft 404s) and why hydrateRoot() cannot be used here.
capturePrerenderSnapshot(container);

createRoot(container).render(<App />);
