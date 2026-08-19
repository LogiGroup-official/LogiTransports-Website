import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { TrafficStatus } from "@/components/traffic-status"
import { LineMaps } from "@/components/line-maps"
import { NetworkNews } from "@/components/network-news"
import { SiteFooter } from "@/components/site-footer"
import { readNetworkData } from "@/lib/data"

// Always read the latest data from disk so admin edits show up immediately.
export const dynamic = "force-dynamic"

export default async function Page() {
  const { lines, news } = await readNetworkData()

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero lines={lines} />
        <TrafficStatus lines={lines} />
        <LineMaps lines={lines} />
        <NetworkNews news={news} />
      </main>
      <SiteFooter lines={lines} />
    </div>
  )
}
