"use client"

import { useState } from "react"
import { ArrowDownCircle, ArrowUpCircle, ChevronDown } from "lucide-react"
import type { Line } from "@/lib/network-data"

function buildSegment(line: Line, from: string, to: string): string[] | null {
  const fromIndex = line.stops.indexOf(from)
  const toIndex = line.stops.indexOf(to)
  if (fromIndex === -1 || toIndex === -1) return null

  if (fromIndex <= toIndex) {
    return line.stops.slice(fromIndex, toIndex + 1)
  }

  if (line.loop) {
    // Wrap around the loop. Avoid double-counting the shared closing stop
    // when the line's first and last recorded stops are the same place.
    const closesOnItself =
      line.stops[0] === line.stops[line.stops.length - 1]
    const tail = line.stops.slice(fromIndex)
    const head = line.stops.slice(0, toIndex + 1)
    return closesOnItself ? [...tail, ...head.slice(1)] : [...tail, ...head]
  }

  // Not a loop: the trip simply runs the other direction along the same stops.
  return line.stops.slice(toIndex, fromIndex + 1).reverse()
}

export function RouteSegment({
  line,
  from,
  to,
}: {
  line: Line
  from: string
  to: string
}) {
  const [expanded, setExpanded] = useState(false)
  const segment = buildSegment(line, from, to)
  if (!segment) return null

  const COLLAPSE_THRESHOLD = 6
  const middle = segment.slice(1, -1)
  const shouldCollapse = !expanded && middle.length > COLLAPSE_THRESHOLD - 2
  const visibleMiddle = shouldCollapse ? [] : middle

  return (
    <div className="rounded-lg border border-border bg-background/40 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span
          className="flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white"
          style={{ backgroundColor: line.color }}
        >
          {line.id}
        </span>
        <span className="text-xs text-muted-foreground">
          {segment.length} arrêt{segment.length > 1 ? "s" : ""} sur ce
          trajet
        </span>
      </div>

      <ol>
        {/* Montée */}
        <SegmentRow
          stop={segment[0]}
          color={line.color}
          icon={<ArrowUpCircle className="size-4" style={{ color: line.color }} />}
          tag="Montez ici"
          isFirst
          isLast={segment.length === 1}
        />

        {shouldCollapse ? (
          <li className="flex gap-4">
            <div className="relative flex w-6 flex-col items-center">
              <span
                className="absolute inset-y-0 w-0.5"
                style={{ backgroundColor: line.color, opacity: 0.4 }}
              />
            </div>
            <div className="flex-1 py-2">
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <ChevronDown className="size-3.5" />
                Afficher les {middle.length} arrêts intermédiaires
              </button>
            </div>
          </li>
        ) : (
          visibleMiddle.map((stop, i) => (
            <SegmentRow
              key={`${stop}-${i}`}
              stop={stop}
              color={line.color}
              small
            />
          ))
        )}

        {/* Descente */}
        {segment.length > 1 && (
          <SegmentRow
            stop={segment[segment.length - 1]}
            color={line.color}
            icon={
              <ArrowDownCircle className="size-4" style={{ color: line.color }} />
            }
            tag="Descendez ici"
            isLast
          />
        )}
      </ol>
    </div>
  )
}

function SegmentRow({
  stop,
  color,
  icon,
  tag,
  isFirst,
  isLast,
  small,
}: {
  stop: string
  color: string
  icon?: React.ReactNode
  tag?: string
  isFirst?: boolean
  isLast?: boolean
  small?: boolean
}) {
  return (
    <li className="flex gap-4">
      <div className="relative flex w-6 shrink-0 flex-col items-center">
        {!isFirst && (
          <span
            className="absolute top-0 h-1/2 w-0.5"
            style={{ backgroundColor: color }}
          />
        )}
        {!isLast && (
          <span
            className="absolute bottom-0 h-1/2 w-0.5"
            style={{ backgroundColor: color }}
          />
        )}
        <span
          className={`relative z-10 rounded-full border-2 bg-card ${
            small ? "mt-2.5 size-2.5" : "mt-2 size-3.5"
          }`}
          style={{ borderColor: color }}
        />
      </div>
      <div className={`flex-1 ${small ? "py-1.5" : "py-2"}`}>
        <div className="flex items-center gap-1.5">
          {icon}
          <p
            className={`font-medium text-foreground ${
              small ? "text-xs text-muted-foreground" : "text-sm"
            }`}
          >
            {stop}
          </p>
        </div>
        {tag && (
          <p
            className="text-xs font-semibold"
            style={{ color }}
          >
            {tag}
          </p>
        )}
      </div>
    </li>
  )
}
