"use client";

import type { ReactNode } from "react";
import { t } from "@/i18n";
import { useLive } from "./LiveConfig";

// Every "Message us" button opens the one chat form (ChatWidget) through this window event; `topic` (the service
// or car the page is about) starts an empty message
export const chatEvent = "open-chat";
export type ChatEventDetail = { topic?: string };

export const ChatIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
  </svg>
);

export function ChatButton({ className, topic, children }: { className?: string; topic?: string; children?: ReactNode }) {
  const { lang } = useLive();
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent<ChatEventDetail>(chatEvent, { detail: { topic } }))}
    >
      {children ?? t(lang).chat.open}
    </button>
  );
}
