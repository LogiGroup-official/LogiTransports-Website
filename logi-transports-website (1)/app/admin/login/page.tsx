"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || "Connexion impossible.")
        return
      }
      router.push("/admin")
      router.refresh()
    } catch {
      setError("Erreur réseau, réessayez.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-border bg-card p-8"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center overflow-hidden rounded-md border border-border">
            <img src="/logo-lt.png" alt="LogiTransports" className="size-full object-cover" />
          </span>
          <span className="text-base font-bold tracking-tight text-foreground">
            Administration
          </span>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Entrez le mot de passe administrateur pour gérer les lignes,
          plans et actualités du réseau.
        </p>

        <label className="mt-6 flex items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-2.5">
          <Lock className="size-4 shrink-0 text-muted-foreground" />
          <input
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </label>

        {error && (
          <p className="mt-3 text-sm font-medium text-destructive">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  )
}
