import type { Line } from "@/lib/network-data"

const footerCols = [
  {
    title: "Voyager",
    links: [
      { label: "Itinéraire", href: "#top" },
      { label: "Titres & tarifs", href: "#" },
      { label: "Horaires", href: "#" },
      { label: "État du trafic", href: "#traffic" },
    ],
  },
  {
    title: "Réseau",
    links: [
      { label: "Lignes & plans", href: "#lines" },
      { label: "Arrêts", href: "#" },
      { label: "Accessibilité", href: "#" },
      { label: "Actualités", href: "#news" },
    ],
  },
  {
    title: "Communauté",
    links: [
      {
        label: "Rejoindre le Discord",
        href: "https://discord.gg/KCDRCg5q3C",
        external: true,
      },
      {
        label: "Jouer sur Roblox",
        href: "https://www.roblox.com/fr/games/85423550071583/LogiTransports-V5",
        external: true,
      },
    ],
  },
  {
    title: "Aide",
    links: [
      { label: "Nous contacter", href: "#" },
      { label: "Objets trouvés", href: "#" },
      { label: "Remboursements", href: "#" },
      { label: "Avis", href: "#" },
    ],
  },
]

export function SiteFooter({ lines }: { lines: Line[] }) {
  return (
    <footer className="border-t border-border bg-sidebar">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2">
            <a href="#top" className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center overflow-hidden rounded-md border border-border">
                <img src="/logo-lt.png" alt="LogiTransports" className="size-full object-cover" />
              </span>
              <span className="text-base font-bold tracking-tight text-foreground">
                LogiTransports
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Au service de la mobilité urbaine avec {lines.length} lignes
              mobilisées chaque jour sur le réseau.
            </p>
          </div>

          {footerCols.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} LogiTransports. Tous droits réservés.
          </p>
          <div className="flex gap-5">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Confidentialité
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Conditions
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
