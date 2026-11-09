"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { localePath, t } from "@/i18n";
import { readConsent, subscribeConsent } from "@/lib/consent";
import { isPhone } from "../../worker/lead";
import { PhoneLink } from "./Live";
import { useLive } from "./LiveConfig";

type Status = "idle" | "sending" | "sent" | "error";

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
  </svg>
);

// A "Message us" button at the bottom right and the form it opens. The message goes to the Worker's
// /api/message (worker/index.ts), which passes it to the workshop's Telegram and the leads sheet; the visitor
// needs no Telegram, the workshop answers on the phone number. `waitForConsent`: while the cookie banner is
// up (no answer yet) the button stays hidden, as both sit at the bottom of the screen.
export function ChatWidget({ waitForConsent }: { waitForConsent: boolean }) {
  const { lang } = useLive();
  const d = t(lang).chat;
  const consent = useSyncExternalStore(subscribeConsent, readConsent, () => undefined);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [website, setWebsite] = useState(""); // hidden from people: only bots fill it in
  const [phoneError, setPhoneError] = useState(false);
  const firstOpened = useRef(0);
  const fab = useRef<HTMLButtonElement>(null);
  const messageField = useRef<HTMLTextAreaElement>(null);
  const phoneField = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLElement>(null);
  const wasOpen = useRef(false);
  const id = useId();

  // Focus moves into the form on open and back to the button on close; Escape closes
  useEffect(() => {
    if (open) messageField.current?.focus();
    else if (wasOpen.current) fab.current?.focus();
    wasOpen.current = open;
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Phones: the on-screen keyboard covers the bottom of the page without moving fixed elements, so the panel
  // gets the covered height (--keyboard) and sits above it
  useEffect(() => {
    const vv = window.visualViewport;
    if (!open || !vv) return;
    const update = () =>
      panel.current?.style.setProperty("--keyboard", `${Math.max(0, Math.round(innerHeight - vv.height - vv.offsetTop))}px`);
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [open]);

  if (waitForConsent && (consent === undefined || consent === null)) return null;

  const show = () => {
    firstOpened.current ||= Date.now();
    setOpen(true);
  };

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isPhone(phone.trim())) {
      setPhoneError(true);
      phoneField.current?.focus();
      return;
    }
    setPhoneError(false);
    setStatus("sending");
    try {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message,
          phone,
          name,
          website,
          page: location.pathname,
          lang,
          elapsed: Date.now() - firstOpened.current,
        }),
      });
      const answer = (await res.json().catch(() => null)) as { ok?: boolean } | null;
      if (!res.ok || !answer?.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("sent");
      setMessage("");
      window.gtag?.("event", "contact", { method: "chat" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <button
        ref={fab}
        type="button"
        className="chat-fab"
        aria-label={d.open}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        hidden={open}
        onClick={show}
      >
        <ChatIcon />
        <span className="chat-fab-label" aria-hidden="true">
          {d.open}
        </span>
      </button>
      {open && (
        <section ref={panel} id={`${id}-panel`} className="chat-panel" role="dialog" aria-labelledby={`${id}-title`}>
          <div className="chat-head">
            <h2 id={`${id}-title`}>{d.title}</h2>
            <button type="button" className="chat-close" aria-label={d.close} onClick={() => setOpen(false)}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          {status === "sent" ? (
            <div className="chat-done" role="status">
              <p>{d.sent}</p>
              <button type="button" className="btn btn-small btn-outline" onClick={() => setStatus("idle")}>
                {d.again}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <p className="chat-note">{d.note}</p>
              <label className="chat-field">
                <span>{d.message}</span>
                <textarea
                  ref={messageField}
                  rows={4}
                  maxLength={2000}
                  placeholder={d.messageHint}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </label>
              <label className="chat-field">
                <span>{d.phone}</span>
                <input
                  ref={phoneField}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={20}
                  required
                  aria-invalid={phoneError}
                  aria-describedby={phoneError ? `${id}-phone-error` : undefined}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
              {phoneError && (
                <p id={`${id}-phone-error`} className="chat-error">
                  {d.phoneInvalid}
                </p>
              )}
              <label className="chat-field">
                <span>
                  {d.name} <small>({d.optional})</small>
                </span>
                <input autoComplete="name" maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <div className="chat-hp" aria-hidden="true">
                <label>
                  Website
                  <input name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </label>
              </div>
              {status === "error" && (
                <p className="chat-error" role="alert">
                  {d.error} <PhoneLink />
                </p>
              )}
              <button type="submit" className="btn" disabled={status === "sending"}>
                {status === "sending" ? d.sending : d.send}
              </button>
              <p className="chat-privacy">
                {d.privacy} <Link href={localePath(lang, "/konfidentsiinist/")}>{d.privacyLink}</Link>.
              </p>
            </form>
          )}
        </section>
      )}
    </>
  );
}
