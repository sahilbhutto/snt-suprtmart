import { useEffect, useState } from "react";

const useCountdown = (initialSeconds: number) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  const [left, setLeft] = useState(initialSeconds);

  useEffect(() => {
    const id = window.setInterval(() => setLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => window.clearInterval(id);
  }, []);

  return {
    hours: pad(Math.floor(left / 3600)),
    minutes: pad(Math.floor((left % 3600) / 60)),
    seconds: pad(left % 60),
  };
};

export default useCountdown
