"use client";

import type { ReactNode } from "react";
import { t } from "@/i18n";
import { useLive } from "./LiveConfig";

// Every "Message us" button opens the one chat form (ChatWidget) through this window event
export const chatEvent = "open-chat";

export const ChatIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
  </svg>
);

// `icon`: just the chat icon, with the label for screen readers (the mobile call bar)
export function ChatButton({ className, icon, children }: { className?: string; icon?: boolean; children?: ReactNode }) {
  const { lang } = useLive();
  const label = t(lang).chat.open;
  return (
    <button
      type="button"
      className={className}
      aria-label={icon ? label : undefined}
      onClick={() => window.dispatchEvent(new Event(chatEvent))}
    >
      {icon ? <ChatIcon /> : (children ?? label)}
    </button>
  );
}
