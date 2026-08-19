export type ServiceStatus = "normal" | "minor" | "major" | "suspended"

export type Category = "structurante" | "urbaine" | "express"

export type Line = {
  id: string
  trajet: string
  category: Category
  color: string
  status: ServiceStatus
  duration: string
  message: string
  stops: string[]
  loop?: boolean
}

export type NewsItem = {
  id: string
  category: string
  title: string
  excerpt: string
  date: string
}

export type NetworkData = {
  lines: Line[]
  news: NewsItem[]
}

export const statusConfig: Record<
  ServiceStatus,
  { label: string; tone: string; dot: string }
> = {
  normal: {
    label: "Trafic normal",
    tone: "text-chart-3",
    dot: "bg-chart-3",
  },
  minor: {
    label: "Perturbations mineures",
    tone: "text-chart-4",
    dot: "bg-chart-4",
  },
  major: {
    label: "Perturbations importantes",
    tone: "text-primary",
    dot: "bg-primary",
  },
  suspended: {
    label: "Ligne non desservie",
    tone: "text-destructive",
    dot: "bg-destructive",
  },
}

export const categoryLabels: Record<Category, string> = {
  structurante: "Ligne structurante",
  urbaine: "Ligne urbaine",
  express: "Ligne express",
}

export const statusOptions: ServiceStatus[] = [
  "normal",
  "minor",
  "major",
  "suspended",
]

export const categoryOptions: Category[] = [
  "structurante",
  "urbaine",
  "express",
]
