"use client";

import { useEffect, useId, useRef, useState } from "react";
import { t } from "@/i18n";
import { ChatButton, ChatIcon } from "./ChatButton";
import { useLive } from "./LiveConfig";

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <circle cx="12" cy="12" r="12" fill="#27a6e5" />
    <path fill="#fff" d="M5.4 11.7l11.3-4.4c.5-.2 1 .1.8.9l-1.9 9c-.1.6-.5.8-1 .5l-2.9-2.1-1.4 1.3c-.2.2-.3.3-.6.3l.2-3 5.5-5c.2-.2 0-.3-.4-.1l-6.8 4.3-2.9-.9c-.6-.2-.6-.6.1-.8z" />
  </svg>
);

const ViberIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <path fill="#7360f2" d="M12 2.5c5.4 0 9 2.7 9 8.1s-3.6 8.1-9 8.1c-.8 0-1.6-.1-2.4-.2L5.8 21.3v-3.9C3.9 16.1 3 13.7 3 10.6 3 5.2 6.6 2.5 12 2.5z" />
    <path fill="#fff" d="M9.3 7.4c.3-.3.8-.3 1 0l1 1.1c.3.3.3.7 0 1l-.5.5c.5 1 1.3 1.8 2.3 2.3l.5-.5c.3-.3.7-.3 1 0l1.1 1c.3.3.3.7 0 1l-.6.6c-.5.5-1.4.7-2.1.3-1.9-1-3.5-2.6-4.5-4.5-.4-.7-.2-1.6.3-2.1z" />
  </svg>
);

// "Message us": one button that opens the three ways to write, Viber, Telegram and the chat on the site (with the
// page's topic). `up` opens the list above the button (the mobile call bar). Closes on a pick, a tap elsewhere or
// Escape.
export function WriteMenu({ className, topic, up }: { className?: string; topic?: string; up?: boolean }) {
  const { live, lang } = useLive();
  const d = t(lang);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!(e.target instanceof Node && box.current?.contains(e.target))) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", away);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", away);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={box} className={`write-menu${up ? " write-menu-up" : ""}`}>
      <button
        type="button"
        className={className}
        aria-expanded={open}
        aria-controls={`${id}-list`}
        onClick={() => setOpen((o) => !o)}
      >
        <ChatIcon />
        {d.write}
      </button>
      {open && (
        // any pick closes the list (the links open the messenger, the chat button the form)
        <div id={`${id}-list`} className="write-menu-list" onClick={() => setOpen(false)}>
          <a href={live.viber} className="write-option">
            <ViberIcon />
            Viber
          </a>
          <a href={live.telegram} className="write-option">
            <TelegramIcon />
            Telegram
          </a>
          <ChatButton className="write-option" topic={topic}>
            <span className="write-option-chat">
              <ChatIcon />
            </span>
            {d.chat.siteChat}
          </ChatButton>
        </div>
      )}
    </div>
  );
}
