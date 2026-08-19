"use client"

import { useState } from "react"
import { Clock } from "lucide-react"
import { statusConfig, categoryLabels, type Line } from "@/lib/network-data"

export function LineMaps({ lines }: { lines: Line[] }) {
  const [activeId, setActiveId] = useState(lines[0]?.id)
  const active = lines.find((l) => l.id === activeId) ?? lines[0]
  const cfg = active ? statusConfig[active.status] : null

  if (!active || !cfg) {
    return (
      <section id="lines" className="border-y border-border bg-sidebar">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            Aucune ligne n'est encore configurée.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      id="lines"
      className="border-y border-border bg-sidebar"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Lignes &amp; plans
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sélectionnez une ligne pour découvrir son trajet et ses terminus sur
            le réseau.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
          {/* Sélecteur de ligne */}
          <ul className="flex max-h-[640px] flex-col gap-2 overflow-y-auto pr-1 lg:max-h-none lg:overflow-visible">
            {lines.map((line) => {
              const isActive = line.id === activeId
              return (
                <li key={line.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(line.id)}
                    className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                      isActive
                        ? "border-primary bg-card"
                        : "border-border bg-card/40 hover:bg-card"
                    }`}
                    aria-pressed={isActive}
                  >
                    <span
                      className="flex size-8 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white"
                      style={{ backgroundColor: line.color }}
                    >
                      {line.id}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col leading-tight">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {line.trajet}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {categoryLabels[line.category]}
                      </span>
                    </span>
                    <span
                      className={`size-2 shrink-0 rounded-full ${statusConfig[line.status].dot}`}
                      aria-hidden="true"
                    />
                  </button>
                </li>
              )
            })}
          </ul>

          {/* Plan de ligne */}
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-md text-sm font-bold text-white"
                  style={{ backgroundColor: active.color }}
                >
                  {active.id}
                </span>
                <div>
                  <p className="text-lg font-bold text-foreground">
                    Ligne {active.id}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {categoryLabels[active.category]}
                    {active.loop ? " · Ligne en boucle" : ""}
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1">
                <span className={`size-2 rounded-full ${cfg.dot}`} />
                <span className={`text-xs font-semibold ${cfg.tone}`}>
                  {cfg.label}
                </span>
              </span>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-2.5">
              <Clock className="size-4 shrink-0 text-primary" />
              <span className="text-sm text-foreground">
                Temps de parcours :{" "}
                <span className="font-semibold">{active.duration}</span>
              </span>
            </div>

            <ol className="mt-8 space-y-0">
              {active.stops.map((stop, i) => {
                const isFirst = i === 0
                const isLast = i === active.stops.length - 1
                return (
                  <li key={`${stop}-${i}`} className="flex gap-4">
                    <div className="relative flex w-6 flex-col items-center">
                      {!isFirst && (
                        <span
                          className="absolute top-0 h-1/2 w-1"
                          style={{ backgroundColor: active.color }}
                        />
                      )}
                      {!isLast && (
                        <span
                          className="absolute bottom-0 h-1/2 w-1"
                          style={{ backgroundColor: active.color }}
                        />
                      )}
                      <span
                        className="relative z-10 mt-5 size-4 rounded-full border-2 bg-card"
                        style={{ borderColor: active.color }}
                      />
                    </div>
                    <div className="flex-1 pb-6 pt-3.5">
                      <p className="text-sm font-medium text-foreground">
                        {stop}
                      </p>
                      {(isFirst || isLast) && (
                        <p className="text-xs text-muted-foreground">
                          {isFirst ? "Terminus de départ" : "Terminus d'arrivée"}
                        </p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
