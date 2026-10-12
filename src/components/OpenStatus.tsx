"use client";

import { useEffect, useState } from "react";
import { getOpenStatus, type OpenStatus as Status } from "@/lib/hours";
import { useLive } from "./LiveConfig";

// Computed in the browser: the page is static HTML, so the build-time time would be stale.
export function OpenStatus() {
  const { live, lang } = useLive();
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const update = () => setStatus(getOpenStatus(live.schedule, live.timeZone, lang));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [live.schedule, live.timeZone, lang]);

  if (!status) return <span className="status status-pending" aria-hidden />;
  return (
    <span className={`status ${status.open ? "status-open" : "status-closed"}`}>
      <span className="status-dot" />
      {status.text}
    </span>
  );
}
