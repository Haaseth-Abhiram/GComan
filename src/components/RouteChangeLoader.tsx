import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Loading } from "./Loading";

/**
 * Shows the brand loading animation briefly whenever the user navigates
 * between routes. Lazy-loaded routes only trigger Suspense on first visit;
 * this gives consistent visual feedback on every navigation.
 */
const RouteChangeLoader = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 450);
    return () => clearTimeout(t);
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] animate-in fade-in duration-150"
      aria-live="polite"
      aria-busy="true"
    >
      <Loading />
    </div>
  );
};

export default RouteChangeLoader;
