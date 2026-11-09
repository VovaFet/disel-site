import Link from "next/link";
import { landingSections, type Locale, type SiteConfig } from "@/config/types";
import { localePath, t } from "@/i18n";
import { ChatButton } from "./ChatButton";
import { CookieSettingsLink } from "./CookieBanner";
import { HeaderShell } from "./HeaderShell";
import { HomeLink } from "./IntentLink";
import { LangSwitcher } from "./LangSwitcher";
import { Logo } from "./Logo";
import { HoursList, MessengerLink, PhoneLink } from "./Live";
import { MobileMenu } from "./MobileMenu";
import { OpenStatus } from "./OpenStatus";
import { ThemeToggle } from "./ThemeToggle";

// Brand/series, vehicle and article sections that have pages, for the mobile menu and the footer
const sectionLinks = (lang: Locale, config: SiteConfig) =>
  landingSections
    .filter((s) => config.landings.some((l) => l.section === s))
    .map((s) => ({ href: localePath(lang, `/${s}/`), label: t(lang).sections[s].title }))
    .concat(config.articles.length ? [{ href: localePath(lang, "/statti/"), label: t(lang).articles.title }] : []);

export function SiteHeader({ lang, config, notFound }: { lang: Locale; config: SiteConfig; notFound?: boolean }) {
  const d = t(lang);
  const p = (path: string) => localePath(lang, path);
  return (
    <HeaderShell>
      <div className="container header-inner">
        <div className="brand">
          <HomeLink href={p("/")} className="logo">
            <Logo name={config.texts.name[lang]} />
          </HomeLink>
          <div className="header-status">
            <OpenStatus />
          </div>
        </div>
        <nav aria-label={d.mainMenu} className="nav">
          <Link href={p("/poslugy/")}>{d.nav.services}</Link>
          <Link href={p("/kalkulyator/")}>{d.nav.calculator}</Link>
          <Link href={p("/kontakty/")}>{d.nav.contacts}</Link>
          <PhoneLink className="btn btn-small" />
        </nav>
        <LangSwitcher notFound={notFound} />
        <ThemeToggle />
        <MobileMenu
          links={[
            { href: p("/"), label: d.nav.home },
            { href: p("/poslugy/"), label: d.nav.servicesFull },
            ...sectionLinks(lang, config),
            { href: p("/kalkulyator/"), label: d.nav.calculator },
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
          <div className="logo footer-logo">
            <Logo name={config.texts.name[lang]} size={28} />
          </div>
          {config.texts.slogan[lang] && <p className="footer-slogan">{config.texts.slogan[lang]}</p>}
          {config.texts.street[lang] && (
            <p>
              {config.texts.city[lang]}, {config.texts.street[lang]}
            </p>
          )}
          <p>
            <PhoneLink />
          </p>
          <p>
            <MessengerLink kind="viber">Viber</MessengerLink> · <MessengerLink kind="telegram">Telegram</MessengerLink> ·{" "}
            <ChatButton className="link-button" />
          </p>
        </div>
        <nav aria-label={d.footerInfo}>
          <strong>{d.footerInfo}</strong>
          <ul>
            <li>
              <Link href={localePath(lang, "/poslugy/")}>{d.nav.servicesFull}</Link>
            </li>
            <li>
              <Link href={localePath(lang, "/kalkulyator/")}>{d.nav.calculator}</Link>
            </li>
            {sectionLinks(lang, config).map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
            <li>
              <Link href={localePath(lang, "/dostavka/")}>{d.nav.delivery}</Link>
            </li>
            <li>
              <Link href={localePath(lang, "/pro-nas/")}>{d.nav.about}</Link>
            </li>
            <li>
              <Link href={localePath(lang, "/kontakty/")}>{d.nav.contacts}</Link>
            </li>
            <li>
              <Link href={localePath(lang, "/konfidentsiinist/")}>{d.nav.privacy}</Link>
            </li>
            {(config.gaId || config.adsId) && (
              <li>
                <CookieSettingsLink />
              </li>
            )}
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
        <ChatButton className="btn btn-outline callbar-chat" icon />
      </div>
    </footer>
  );
}
