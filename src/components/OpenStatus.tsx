"use client";

import { useEffect, useState } from "react";
import { t } from "@/i18n";
import { getOpenStatus, type OpenStatus as Status } from "@/lib/hours";
import { ChatButton } from "./ChatButton";
import { useLive } from "./LiveConfig";

// Computed in the browser: the page is static HTML, so the build-time time would be stale.
// `chat`: while closed, a "message us, we'll reply as soon as we open" link to the chat under it
export function OpenStatus({ chat = false }: { chat?: boolean }) {
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
      <span>
        {status.text}
        {status.next && (
          <span className="status-next">
            <span className="status-sep"> · </span>
            {status.next}
          </span>
        )}
        {chat && !status.open && (
          <span className="status-chat">
            <ChatButton className="link-button">{t(lang).chat.whenClosed}</ChatButton>
          </span>
        )}
      </span>
    </span>
  );
}
