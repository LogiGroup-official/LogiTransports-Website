import fs from "node:fs"
import path from "node:path"
import type { NetworkData } from "@/lib/network-data"

const DATA_PATH = path.join(process.cwd(), "data", "network-data.json")
const KV_KEY = "logitransports:network-data"

// On Vercel, the filesystem is read-only in production, so we use an
// Upstash Redis database there instead (installed from the Vercel
// Marketplace — see .env.local.example). Locally, or anywhere those env
// vars aren't set, we fall back to reading/writing the JSON file on disk —
// no setup needed for dev.
// Vercel's Upstash Marketplace integration can inject either naming
// convention depending on setup — support both.
function getKvCredentials() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  return url && token ? { url, token } : null
}


function readSeedFile(): NetworkData {
  const raw = fs.readFileSync(DATA_PATH, "utf-8")
  return JSON.parse(raw) as NetworkData
}

export async function readNetworkData(): Promise<NetworkData> {
  const creds = getKvCredentials()
  if (creds) {
    const { Redis } = await import("@upstash/redis")
    const redis = new Redis(creds)
    const data = await redis.get<NetworkData>(KV_KEY)
    if (data) return data
    // First run: seed Redis from the bundled JSON so the site isn't empty.
    const seed = readSeedFile()
    await redis.set(KV_KEY, seed)
    return seed
  }
  return readSeedFile()
}

export async function writeNetworkData(data: NetworkData) {
  const creds = getKvCredentials()
  if (creds) {
    const { Redis } = await import("@upstash/redis")
    const redis = new Redis(creds)
    await redis.set(KV_KEY, data)
    return
  }
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8")
}
