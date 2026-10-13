// Articles and repair case studies (content plan stage 4) under /statti/, from the sheet tab
// articles. The list page is always built (a static export needs one page per route); it stays out
// of the menus, the sitemap and search results until there are articles.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { LinkCards } from "@/components/LinkCards";
import { ContactActions } from "@/components/Live";
import { RichText } from "@/components/RichText";
import { ServiceList } from "@/components/ServiceList";
import { SheetImage } from "@/components/SheetImage";
import { getConfig } from "@/config";
import type { Article, Locale } from "@/config/types";
import { formatDate, localePath, t } from "@/i18n";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "./RootShell";

const articlePath = (slug?: string) => `/statti/${slug ? `${slug}/` : ""}`;

export async function articleParams() {
  const c = await getConfig();
  return [{ slug: [] as string[] }, ...c.articles.map((a) => ({ slug: [a.slug] }))];
}

// Date and the "case study" label shown with an article
function ArticleMeta({ lang, article }: { lang: Locale; article: Article }) {
  return (
    <span className="article-meta">
      <time dateTime={article.date}>{formatDate(lang, article.date)}</time>
      {article.isCase && <span className="tag">{t(lang).caseLabel}</span>}
    </span>
  );
}

export function ArticleCards({ lang, articles }: { lang: Locale; articles: Article[] }) {
  return (
    <LinkCards
      items={articles.map((a) => ({
        href: localePath(lang, articlePath(a.slug)),
        title: a.title[lang],
        text: a.description[lang],
        kicker: <ArticleMeta lang={lang} article={a} />,
      }))}
    />
  );
}

export async function articleMetadata(lang: Locale, slug?: string[]): Promise<Metadata> {
  const c = await getConfig();
  const d = t(lang);
  if (!slug?.length) {
    const meta = pageMetadata(lang, articlePath(), { title: d.articles.title, description: d.articles.intro });
    return c.articles.length ? meta : { ...meta, robots: { index: false } };
  }
  const a = c.articles.find((x) => x.slug === slug[0]);
  if (!a) return {};
  return pageMetadata(lang, articlePath(a.slug), { title: a.title[lang], description: a.description[lang] });
}

export function ArticleRoute({ lang, slug }: { lang: Locale; slug?: string[] }) {
  return slug?.length ? <ArticlePage lang={lang} slug={slug[0]} /> : <ArticleIndex lang={lang} />;
}

async function ArticleIndex({ lang }: { lang: Locale }) {
  const c = await getConfig();
  const d = t(lang);
  return (
    <section className="container section">
      <h1>{d.articles.title}</h1>
      <p className="lead">{d.articles.intro}</p>
      {c.articles.length > 0 ? <ArticleCards lang={lang} articles={c.articles} /> : <p className="muted">{d.sectionEmpty}</p>}
    </section>
  );
}

async function ArticlePage({ lang, slug }: { lang: Locale; slug: string }) {
  const c = await getConfig();
  const a = c.articles.find((x) => x.slug === slug);
  if (!a) notFound();
  const d = t(lang);
  const p = (path: string) => localePath(lang, path);
  const services = c.services.filter((s) => a.services.includes(s.slug));

  return (
    <article className="container section">
      <JsonLd
        data={[
          breadcrumbSchema(c, lang, [
            [d.nav.home, "/"],
            [d.articles.title, articlePath()],
            [a.title[lang], articlePath(a.slug)],
          ]),
          articleSchema(c, a, lang, articlePath(a.slug)),
        ]}
      />
      <nav aria-label={d.breadcrumbs} className="breadcrumbs">
        <Link href={p("/")}>{d.nav.home}</Link> / <Link href={p(articlePath())}>{d.articles.title}</Link> /{" "}
        <span>{a.title[lang]}</span>
      </nav>

      <ArticleMeta lang={lang} article={a} />
      <h1>{a.title[lang]}</h1>
      {a.description[lang] && <p className="lead">{a.description[lang]}</p>}
      {a.image && <SheetImage src={a.image} alt={a.title[lang]} className="article-cover" />}
      <RichText text={a.body[lang]} />

      <ContactActions label={d.book} />

      {services.length > 0 && (
        <section className="related">
          <h2>{d.relatedServices}</h2>
          <ServiceList lang={lang} services={services} />
        </section>
      )}
    </article>
  );
}
