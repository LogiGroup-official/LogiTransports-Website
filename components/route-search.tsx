"use client"

import { useState, type FormEvent } from "react"
import { MapPin, Search, ArrowRight, Repeat } from "lucide-react"
import { categoryLabels, type Line } from "@/lib/network-data"
import { RouteSegment } from "@/components/route-segment"

function normalize(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

function matchStop(stopName: string, query: string) {
  return normalize(stopName).includes(normalize(query))
}

function findMatchingStop(line: Line, query: string) {
  return line.stops.find((s) => matchStop(s, query))
}

function linesServingStop(lines: Line[], query: string) {
  return lines.filter((l) => l.stops.some((s) => matchStop(s, query)))
}

// Rough contrast check so line badges stay readable on any picto color.
function textColorFor(hex: string) {
  const clean = hex.replace("#", "")
  if (clean.length !== 6) return "#111111"
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? "#111111" : "#ffffff"
}

function LineBadge({ line }: { line: Line }) {
  return (
    <span
      className="inline-flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 text-xs font-bold"
      style={{ backgroundColor: line.color, color: textColorFor(line.color) }}
    >
      {line.id}
    </span>
  )
}

type DirectResult = { type: "direct"; line: Line; from: string; to: string }
type TransferResult = {
  type: "transfer"
  line1: Line
  line2: Line
  from: string
  transferStop: string
  to: string
}
type Result = DirectResult | TransferResult

export function RouteSearch({ lines }: { lines: Line[] }) {
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [searched, setSearched] = useState(false)
  const [results, setResults] = useState<Result[]>([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSearched(true)
    setErrorMsg(null)

    const from = origin.trim()
    const to = destination.trim()

    if (!from || !to) {
      setErrorMsg("Merci de renseigner un arrêt de départ et d'arrivée.")
      setResults([])
      return
    }

    const originLines = linesServingStop(lines, from)
    const destLines = linesServingStop(lines, to)

    if (originLines.length === 0) {
      setErrorMsg(`Aucun arrêt ne correspond à "${from}".`)
      setResults([])
      return
    }
    if (destLines.length === 0) {
      setErrorMsg(`Aucun arrêt ne correspond à "${to}".`)
      setResults([])
      return
    }

    // 1) Direct lines serving both stops.
    const direct: DirectResult[] = []
    for (const line of lines) {
      const fromStop = findMatchingStop(line, from)
      const toStop = findMatchingStop(line, to)
      if (fromStop && toStop && fromStop !== toStop) {
        direct.push({ type: "direct", line, from: fromStop, to: toStop })
      }
    }

    if (direct.length > 0) {
      setResults(direct)
      return
    }

    // 2) One-transfer suggestions: a stop shared between an origin line and a destination line.
    const transfers: TransferResult[] = []
    const seen = new Set<string>()
    for (const l1 of originLines) {
      const fromStop = findMatchingStop(l1, from)
      if (!fromStop) continue
      for (const l2 of destLines) {
        if (l1.id === l2.id) continue
        const toStop = findMatchingStop(l2, to)
        if (!toStop) continue
        const shared = l1.stops.find((s1) =>
          l2.stops.some((s2) => normalize(s1) === normalize(s2))
        )
        if (!shared) continue
        const key = `${l1.id}-${l2.id}-${shared}`
        if (seen.has(key)) continue
        seen.add(key)
        transfers.push({
          type: "transfer",
          line1: l1,
          line2: l2,
          from: fromStop,
          transferStop: shared,
          to: toStop,
        })
      }
    }

    setResults(transfers.slice(0, 5))
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-card/70 p-2 backdrop-blur sm:flex sm:items-center sm:gap-2"
      >
        <div className="flex flex-1 items-center gap-2 rounded-lg bg-background/60 px-3 py-2.5">
          <MapPin className="size-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Départ — ex. AURILLAC La Montade"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <div className="mt-2 flex flex-1 items-center gap-2 rounded-lg bg-background/60 px-3 py-2.5 sm:mt-0">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Arrivée — où allez-vous ?"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:mt-0 sm:w-auto"
        >
          Rechercher
          <ArrowRight className="size-4" />
        </button>
      </form>

      {searched && (
        <div className="mt-4 rounded-xl border border-border bg-card/70 p-4 backdrop-blur">
          {errorMsg && (
            <p className="text-sm text-muted-foreground">{errorMsg}</p>
          )}

          {!errorMsg && results.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Aucun trajet direct ni avec une correspondance n'a été trouvé
              entre ces deux arrêts. Essayez un nom d'arrêt plus précis, ou
              consultez le{" "}
              <a href="#lines" className="text-primary hover:underline">
                plan complet des lignes
              </a>
              .
            </p>
          )}

          {!errorMsg && results.length > 0 && (
            <ul className="flex flex-col gap-4">
              {results.map((r, i) => (
                <li key={i}>
                  {r.type === "direct" ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-muted-foreground">
                          {categoryLabels[r.line.category]} · trajet direct
                        </span>
                      </div>
                      <RouteSegment line={r.line} from={r.from} to={r.to} />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <LineBadge line={r.line1} />
                        <Repeat className="size-3.5 text-muted-foreground" />
                        <LineBadge line={r.line2} />
                        <span className="text-muted-foreground">
                          1 correspondance à {r.transferStop}
                        </span>
                      </div>
                      <RouteSegment
                        line={r.line1}
                        from={r.from}
                        to={r.transferStop}
                      />
                      <RouteSegment
                        line={r.line2}
                        from={r.transferStop}
                        to={r.to}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
