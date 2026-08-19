"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Save, LogOut, Loader2 } from "lucide-react"
import {
  categoryLabels,
  categoryOptions,
  statusConfig,
  statusOptions,
  type Line,
  type NewsItem,
} from "@/lib/network-data"

type Tab = "lines" | "news"

function emptyLine(): Line {
  return {
    id: "",
    trajet: "",
    category: "urbaine",
    color: "#f97316",
    status: "normal",
    duration: "",
    message: "",
    stops: [],
    loop: false,
  }
}

function emptyNews(): NewsItem {
  return {
    id: `n${Date.now()}`,
    category: "",
    title: "",
    excerpt: "",
    date: "",
  }
}

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("lines")
  const [lines, setLines] = useState<Line[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/network")
      .then((res) => res.json())
      .then((data) => {
        setLines(data.lines || [])
        setNews(data.news || [])
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/network", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines, news }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setMessage(data.error || "Échec de l'enregistrement.")
        return
      }
      setMessage("Modifications enregistrées.")
      router.refresh()
    } catch {
      setMessage("Erreur réseau, réessayez.")
    } finally {
      setSaving(false)
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" })
    router.push("/admin/login")
    router.refresh()
  }

  function updateLine(index: number, patch: Partial<Line>) {
    setLines((prev) =>
      prev.map((l, i) => (i === index ? { ...l, ...patch } : l))
    )
  }

  function updateNews(index: number, patch: Partial<NewsItem>) {
    setNews((prev) =>
      prev.map((n, i) => (i === index ? { ...n, ...patch } : n))
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center overflow-hidden rounded-md border border-border">
              <img src="/logo-lt.png" alt="LogiTransports" className="size-full object-cover" />
            </span>
            <span className="text-base font-bold tracking-tight text-foreground">
              Administration LogiTransports
            </span>
          </div>
          <div className="flex items-center gap-2">
            {message && (
              <span className="text-xs font-medium text-muted-foreground">
                {message}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Enregistrer
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-4" />
              Déconnexion
            </button>
          </div>
        </div>

        <div className="mx-auto flex max-w-5xl gap-1 px-4 pb-3 sm:px-6">
          <button
            onClick={() => setTab("lines")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              tab === "lines"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Lignes & plans ({lines.length})
          </button>
          <button
            onClick={() => setTab("news")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              tab === "news"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Actualités ({news.length})
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {tab === "lines" && (
          <div className="flex flex-col gap-5">
            {lines.map((line, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
                    <Field label="Identifiant">
                      <input
                        value={line.id}
                        onChange={(e) => updateLine(i, { id: e.target.value })}
                        className="input"
                        placeholder="A, 13, 10E…"
                      />
                    </Field>
                    <Field label="Catégorie">
                      <select
                        value={line.category}
                        onChange={(e) =>
                          updateLine(i, {
                            category: e.target.value as Line["category"],
                          })
                        }
                        className="input"
                      >
                        {categoryOptions.map((c) => (
                          <option key={c} value={c}>
                            {categoryLabels[c]}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Statut">
                      <select
                        value={line.status}
                        onChange={(e) =>
                          updateLine(i, {
                            status: e.target.value as Line["status"],
                          })
                        }
                        className="input"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {statusConfig[s].label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Couleur">
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={line.color}
                          onChange={(e) =>
                            updateLine(i, { color: e.target.value })
                          }
                          className="size-9 shrink-0 rounded-md border border-border bg-transparent"
                        />
                        <input
                          value={line.color}
                          onChange={(e) =>
                            updateLine(i, { color: e.target.value })
                          }
                          className="input"
                        />
                      </div>
                    </Field>
                    <Field label="Trajet" full>
                      <input
                        value={line.trajet}
                        onChange={(e) =>
                          updateLine(i, { trajet: e.target.value })
                        }
                        className="input"
                        placeholder="Terminus A — Terminus B"
                      />
                    </Field>
                    <Field label="Durée">
                      <input
                        value={line.duration}
                        onChange={(e) =>
                          updateLine(i, { duration: e.target.value })
                        }
                        className="input"
                        placeholder="12 min"
                      />
                    </Field>
                    <Field label="Ligne en boucle">
                      <label className="flex h-9 items-center gap-2 text-sm text-foreground">
                        <input
                          type="checkbox"
                          checked={!!line.loop}
                          onChange={(e) =>
                            updateLine(i, { loop: e.target.checked })
                          }
                        />
                        Boucle
                      </label>
                    </Field>
                    <Field label="Arrêts (séparés par des virgules)" full>
                      <input
                        value={line.stops.join(", ")}
                        onChange={(e) =>
                          updateLine(i, {
                            stops: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        className="input"
                        placeholder="Terminus A, Arrêt intermédiaire, Terminus B"
                      />
                    </Field>
                    <Field label="Message d'information" full>
                      <textarea
                        value={line.message}
                        onChange={(e) =>
                          updateLine(i, { message: e.target.value })
                        }
                        rows={2}
                        className="input resize-y"
                      />
                    </Field>
                  </div>
                  <button
                    onClick={() =>
                      setLines((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    className="shrink-0 rounded-md border border-border p-2 text-muted-foreground hover:border-destructive/40 hover:text-destructive"
                    aria-label="Supprimer la ligne"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => setLines((prev) => [...prev, emptyLine()])}
              className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-4 text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground"
            >
              <Plus className="size-4" />
              Ajouter une ligne
            </button>
          </div>
        )}

        {tab === "news" && (
          <div className="flex flex-col gap-5">
            {news.map((item, i) => (
              <div
                key={item.id}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3">
                    <Field label="Catégorie">
                      <input
                        value={item.category}
                        onChange={(e) =>
                          updateNews(i, { category: e.target.value })
                        }
                        className="input"
                        placeholder="Réseau, Travaux…"
                      />
                    </Field>
                    <Field label="Date">
                      <input
                        value={item.date}
                        onChange={(e) =>
                          updateNews(i, { date: e.target.value })
                        }
                        className="input"
                        placeholder="9 juin 2026"
                      />
                    </Field>
                    <Field label="Identifiant">
                      <input
                        value={item.id}
                        onChange={(e) =>
                          updateNews(i, { id: e.target.value })
                        }
                        className="input"
                      />
                    </Field>
                    <Field label="Titre" full>
                      <input
                        value={item.title}
                        onChange={(e) =>
                          updateNews(i, { title: e.target.value })
                        }
                        className="input"
                      />
                    </Field>
                    <Field label="Extrait" full>
                      <textarea
                        value={item.excerpt}
                        onChange={(e) =>
                          updateNews(i, { excerpt: e.target.value })
                        }
                        rows={2}
                        className="input resize-y"
                      />
                    </Field>
                  </div>
                  <button
                    onClick={() =>
                      setNews((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    className="shrink-0 rounded-md border border-border p-2 text-muted-foreground hover:border-destructive/40 hover:text-destructive"
                    aria-label="Supprimer l'actualité"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => setNews((prev) => [...prev, emptyNews()])}
              className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-4 text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground"
            >
              <Plus className="size-4" />
              Ajouter une actualité
            </button>
          </div>
        )}
      </main>

      <style jsx global>{`
        .input {
          width: 100%;
          height: 2.25rem;
          border-radius: 0.5rem;
          border: 1px solid var(--border);
          background: color-mix(in oklch, var(--background) 50%, transparent);
          padding: 0 0.65rem;
          font-size: 0.875rem;
          color: var(--foreground);
        }
        textarea.input {
          height: auto;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
        }
        .input:focus {
          outline: 2px solid color-mix(in oklch, var(--ring) 50%, transparent);
          outline-offset: 1px;
        }
      `}</style>
    </div>
  )
}

function Field({
  label,
  full,
  children,
}: {
  label: string
  full?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={full ? "col-span-2 sm:col-span-4" : ""}>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  )
}
