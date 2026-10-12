import Link from "next/link";
import type { Locale, SiteConfig } from "@/config/types";
import { localePath, t } from "@/i18n";
import { HeaderShell } from "./HeaderShell";
import { LangSwitcher } from "./LangSwitcher";
import { HoursList, MessengerLink, PhoneLink } from "./Live";
import { MobileMenu } from "./MobileMenu";
import { OpenStatus } from "./OpenStatus";

export function SiteHeader({ lang, config }: { lang: Locale; config: SiteConfig }) {
  const d = t(lang);
  const p = (path: string) => localePath(lang, path);
  return (
    <HeaderShell>
      <div className="container header-inner">
        <Link href={p("/")} className="logo">
          {config.texts.name[lang]}
        </Link>
        <nav aria-label={d.mainMenu} className="nav">
          <Link href={p("/poslugy/")}>{d.nav.services}</Link>
          <Link href={`${p("/")}#calculator`}>{d.nav.calculator}</Link>
          <Link href={p("/kontakty/")}>{d.nav.contacts}</Link>
          <PhoneLink className="btn btn-small" />
        </nav>
        <LangSwitcher />
        <MobileMenu
          links={[
            { href: p("/"), label: d.nav.home },
            { href: p("/poslugy/"), label: d.nav.servicesFull },
            { href: `${p("/")}#calculator`, label: d.nav.calculator },
            { href: p("/dostavka/"), label: d.nav.delivery },
            { href: p("/pro-nas/"), label: d.nav.about },
            { href: p("/kontakty/"), label: d.nav.contacts },
          ]}
        />
      </div>
    </HeaderShell>
  );
}

export function SiteFooter({ lang, config }: { lang: Locale; config: SiteConfig }) {
  const d = t(lang);
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <strong>{config.texts.name[lang]}</strong>
          <p>
            {config.texts.city[lang]}, {config.texts.street[lang]}
          </p>
          <p>
            <PhoneLink />
          </p>
          <p>
            <MessengerLink kind="viber">Viber</MessengerLink> · <MessengerLink kind="telegram">Telegram</MessengerLink>
          </p>
        </div>
        <nav aria-label={d.footerInfo}>
          <strong>{d.footerInfo}</strong>
          <ul>
            <li>
              <Link href={localePath(lang, "/poslugy/")}>{d.nav.servicesFull}</Link>
            </li>
            <li>
              <Link href={localePath(lang, "/dostavka/")}>{d.nav.delivery}</Link>
            </li>
            <li>
              <Link href={localePath(lang, "/pro-nas/")}>{d.nav.about}</Link>
            </li>
            <li>
              <Link href={localePath(lang, "/kontakty/")}>{d.nav.contacts}</Link>
            </li>
          </ul>
        </nav>
        <div>
          <OpenStatus />
          <HoursList />
        </div>
      </div>
      {/* Sticky call/messenger bar on mobile: phone calls are the main conversion */}
      <div className="callbar">
        <PhoneLink className="btn">{d.call}</PhoneLink>
        <MessengerLink kind="viber" className="btn btn-outline">
          Viber
        </MessengerLink>
        <MessengerLink kind="telegram" className="btn btn-outline">
          Telegram
        </MessengerLink>
      </div>
    </footer>
  );
}
