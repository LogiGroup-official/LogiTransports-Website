import type { NewsItem } from "@/lib/network-data"
import { ArrowUpRight } from "lucide-react"

export function NetworkNews({ news }: { news: NewsItem[] }) {
  if (news.length === 0) return null
  const [featured, ...rest] = news

  return (
    <section id="news" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Actualités du réseau
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Évolutions du service, améliorations et annonces.
          </p>
        </div>
        <a
          href="#news"
          className="text-sm font-semibold text-primary transition-opacity hover:opacity-80"
        >
          Voir toutes les actualités
        </a>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <article className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 sm:p-8">
          <div>
            <span className="inline-flex rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              {featured.category}
            </span>
            <h3 className="mt-4 text-balance text-xl font-bold leading-snug text-foreground sm:text-2xl">
              {featured.title}
            </h3>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
              {featured.excerpt}
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {featured.date}
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold text-primary">
              Lire la suite
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </article>

        <ul className="flex flex-col gap-4">
          {rest.map((item) => (
            <li key={item.id}>
              <article className="group flex items-start justify-between gap-4 rounded-xl border border-border bg-card/50 p-5 transition-colors hover:bg-card">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                      {item.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.date}
                    </span>
                  </div>
                  <h3 className="mt-2 text-pretty text-base font-semibold leading-snug text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.excerpt}
                  </p>
                </div>
                <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
