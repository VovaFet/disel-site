"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { t } from "@/i18n";
import { ChatButton, ChatIcon } from "./ChatButton";
import { useLive } from "./LiveConfig";

// The three options' icons: same-size circles in each one's colour with a white symbol
const OptionIcon = ({ color, children }: { color: string; children: ReactNode }) => (
  <svg className="write-option-icon" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
    <circle cx="12" cy="12" r="12" fill={color} />
    {children}
  </svg>
);

const ViberIcon = () => (
  <OptionIcon color="#7360f2">
    {/* a phone handset */}
    <path
      fill="#fff"
      transform="translate(5.6 5.6) scale(0.54)"
      d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .7-.2 1z"
    />
  </OptionIcon>
);

const TelegramIcon = () => (
  <OptionIcon color="#27a6e5">
    {/* a paper plane */}
    <path fill="#fff" d="M5.4 11.7l11.3-4.4c.5-.2 1 .1.8.9l-1.9 9c-.1.6-.5.8-1 .5l-2.9-2.1-1.4 1.3c-.2.2-.3.3-.6.3l.2-3 5.5-5c.2-.2 0-.3-.4-.1l-6.8 4.3-2.9-.9c-.6-.2-.6-.6.1-.8z" />
  </OptionIcon>
);

const SiteChatIcon = () => (
  <OptionIcon color="var(--accent-bg)">
    {/* the chat bubble of ChatIcon, white */}
    <path
      fill="none"
      stroke="#fff"
      strokeWidth="3.4"
      strokeLinejoin="round"
      transform="translate(5.5 5.5) scale(0.54)"
      d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"
    />
  </OptionIcon>
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
            <SiteChatIcon />
            {d.chat.siteChat}
          </ChatButton>
        </div>
      )}
    </div>
  );
}
