import { useEffect, useState } from "react";

/** Seconds left until a timestamp (0 when it has passed). Updates every second */
export const useSecondsUntil = (target: number | null) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (target === null) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return target === null ? 0 : Math.max(0, Math.ceil((target - now) / 1000));
};
