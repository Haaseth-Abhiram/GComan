import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Navigation feedback on route change.
 *
 * This used to mount the full-screen brand <Loading /> as an opaque
 * z-[9999] overlay for a fixed 450 ms on EVERY navigation. Client-side
 * navigation between already-loaded routes is instant, so that added a
 * deliberate white flash and hid a page that had already rendered — it read
 * as slowness rather than polish, and the overlay swallowed pointer input
 * while it was up. A thin top progress bar gives the same "something is
 * happening" signal at zero perceived cost. The full-screen loader is still
 * the Suspense fallback in App.tsx for genuinely un-loaded route chunks.
 */
const RouteChangeLoader = () => {
  const location = useLocation();
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    setPhase("loading");
    const grow = setTimeout(() => setPhase("done"), 180);
    const hide = setTimeout(() => setPhase("idle"), 520);
    return () => {
      clearTimeout(grow);
      clearTimeout(hide);
    };
  }, [location.pathname]);

  if (phase === "idle") return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-0.5 pointer-events-none" role="status">
      <span className="sr-only">Loading page</span>
      <div
        className="h-full bg-gradient-to-r from-[hsl(var(--logo-blue))] to-[hsl(var(--logo-orange))] transition-[width,opacity] ease-out motion-reduce:transition-none"
        style={{
          width: phase === "done" ? "100%" : "35%",
          opacity: phase === "done" ? 0 : 1,
          transitionDuration: phase === "done" ? "340ms" : "180ms",
        }}
      />
    </div>
  );
};

export default RouteChangeLoader;
