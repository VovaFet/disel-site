"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { localePath, t } from "@/i18n";
import { maskPhone, phoneMask, phonePrefix, toUaPhone } from "@/lib/phone";
import { chatEvent, ChatIcon, type ChatEventDetail } from "./ChatButton";
import { PhoneLink } from "./Live";
import { OpenStatus } from "./OpenStatus";
import { useLive } from "./LiveConfig";

type Status = "idle" | "sending" | "sent" | "error";

// The chat form, opened by the "Message us" button at the bottom right (wide screens; phones have it in the
// call bar) or any ChatButton on the page. The message goes to the Worker's /api/message (worker/index.ts),
// which passes it to the workshop's Telegram and the leads sheet; the visitor needs no Telegram, the workshop
// answers on the phone number.
export function ChatWidget() {
  const { lang } = useLive();
  const d = t(lang).chat;
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [website, setWebsite] = useState(""); // hidden from people: only bots fill it in
  const [phoneError, setPhoneError] = useState(false);
  const firstOpened = useRef(0);
  const messageField = useRef<HTMLTextAreaElement>(null);
  const phoneField = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLElement>(null);
  // the button that opened the form gets the focus back
  const opener = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);
  // the page's service or car, put at the start of an empty message
  const [topic, setTopic] = useState("");
  const id = useId();

  useEffect(() => {
    const show = (e: Event) => {
      firstOpened.current ||= Date.now();
      if (document.activeElement instanceof HTMLElement) opener.current = document.activeElement;
      const pageTopic = (e as CustomEvent<ChatEventDetail>).detail?.topic;
      if (pageTopic) {
        setTopic(pageTopic);
        setMessage((m) => (m.trim() ? m : `${pageTopic}\n`));
      }
      setOpen(true);
    };
    window.addEventListener(chatEvent, show);
    return () => window.removeEventListener(chatEvent, show);
  }, []);

  // The message field with the caret after what is already in it
  const focusMessage = () => {
    const field = messageField.current;
    field?.focus();
    field?.setSelectionRange(field.value.length, field.value.length);
  };

  // Focus moves into the form on open and back to the button on close; Escape closes
  useEffect(() => {
    if (open) focusMessage();
    else if (wasOpen.current) opener.current?.focus();
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

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fullPhone = toUaPhone(phone);
    if (!fullPhone) {
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
          phone: fullPhone,
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
        type="button"
        className="chat-fab"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        hidden={open}
        onClick={() => window.dispatchEvent(new Event(chatEvent))}
      >
        <ChatIcon />
        {d.open}
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
              {/* Open now, or when the workshop opens: when to expect the reply */}
              <OpenStatus />
              <p className="chat-note">{d.note}</p>
              {/* Ready questions while nothing has been typed yet (the page's topic line doesn't count) */}
              {(!message.trim() || message.trim() === topic) && (
                <div className="chat-chips" role="group" aria-label={d.suggestions}>
                  {d.chips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      className="chip"
                      onClick={() => {
                        setMessage((m) => (m.trim() ? `${m.trimEnd()}\n${chip}` : chip));
                        requestAnimationFrame(focusMessage);
                      }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
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
                  placeholder={phoneMask}
                  required
                  aria-invalid={phoneError}
                  aria-describedby={phoneError ? `${id}-phone-error` : undefined}
                  value={phone}
                  onChange={(e) => setPhone(maskPhone(e.target.value))}
                  onFocus={(e) => {
                    const field = e.currentTarget;
                    if (!phone) setPhone(phonePrefix);
                    // after React has put the prefix in
                    requestAnimationFrame(() => field.setSelectionRange(field.value.length, field.value.length));
                  }}
                  onSelect={(e) => {
                    // the caret never goes inside the prefix
                    const field = e.currentTarget;
                    if ((field.selectionStart ?? 0) < phonePrefix.length) {
                      field.setSelectionRange(field.value.length, field.value.length);
                    }
                  }}
                  onBlur={() => phone === phonePrefix && setPhone("")}
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
