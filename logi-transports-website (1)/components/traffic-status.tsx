import { statusConfig, categoryLabels, type Line } from "@/lib/network-data"
import { CheckCircle2, AlertTriangle } from "lucide-react"

export function TrafficStatus({ lines }: { lines: Line[] }) {
  const disrupted = lines.filter((l) => l.status !== "normal")
  const allGood = disrupted.length === 0

  return (
    <section id="traffic" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Informations trafic
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            État du service en direct, mis à jour en continu sur le réseau.
          </p>
        </div>
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Mis à jour à l'instant
        </p>
      </div>

      <div
        className={`mt-6 flex items-start gap-3 rounded-xl border p-4 ${
          allGood
            ? "border-chart-3/30 bg-chart-3/10"
            : "border-primary/30 bg-primary/10"
        }`}
      >
        {allGood ? (
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-chart-3" />
        ) : (
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-primary" />
        )}
        <div>
          <p className="text-sm font-semibold text-foreground">
            {allGood
              ? "Trafic normal sur toutes les lignes"
              : `${disrupted.length} ligne${disrupted.length > 1 ? "s" : ""} concernée${disrupted.length > 1 ? "s" : ""}`}
          </p>
          <p className="text-sm text-muted-foreground">
            {allGood
              ? "Aucune perturbation n'est actuellement signalée sur le réseau LogiTransports."
              : "Consultez les lignes concernées ci-dessous avant de voyager et prévoyez un temps supplémentaire si nécessaire."}
          </p>
        </div>
      </div>

      <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lines.map((line) => {
          const cfg = statusConfig[line.status]
          return (
            <li
              key={line.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-md text-sm font-bold text-white"
                    style={{ backgroundColor: line.color }}
                  >
                    {line.id}
                  </span>
                  <div className="min-w-0 leading-tight">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {line.trajet}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {categoryLabels[line.category]} · {line.duration}
                    </p>
                  </div>
                </div>
                <span className="flex shrink-0 items-center gap-1.5">
                  <span className={`size-2 rounded-full ${cfg.dot}`} />
                </span>
              </div>
              <p className={`text-xs font-semibold ${cfg.tone}`}>{cfg.label}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {line.message}
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
