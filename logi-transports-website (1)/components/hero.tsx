import { RouteSearch } from "@/components/route-search"
import type { Line } from "@/lib/network-data"

export function Hero({ lines }: { lines: Line[] }) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/hero-network.jpg"
          alt="Un véhicule LogiTransports traversant la ville au crépuscule, avec des traînées lumineuses le long du parcours"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground backdrop-blur">
              <span className="size-1.5 rounded-full bg-chart-3" />
              État du réseau en direct
            </span>
          </div>

          <h1 className="mt-5 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Déplacez-vous dans la ville en toute sérénité.
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Informations trafic en temps réel, plans de lignes et dernières
            actualités sur l'ensemble des lignes du réseau LogiTransports —{" "}
            {lines.length} lignes au service de votre mobilité.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://discord.gg/KCDRCg5q3C"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/70 px-4 py-2.5 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-card"
            >
              <svg viewBox="0 0 127.14 96.36" className="size-4" fill="currentColor" aria-hidden="true">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
              </svg>
              Rejoindre le Discord
            </a>
            <a
              href="https://www.roblox.com/fr/games/85423550071583/LogiTransports-V5"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                <path d="M18.926 0 0 5.075 5.075 24 24 18.925 18.926 0Zm-4.352 15.363-5.937 1.59-1.59-5.937 5.937-1.59 1.59 5.937Z" />
              </svg>
              Jouer sur Roblox
            </a>
          </div>

          <div className="mt-6">
            <RouteSearch lines={lines} />
          </div>
        </div>
      </div>
    </section>
  )
}
