import { join } from "https://deno.land/std@0.224.0/path/mod.ts"
import { ensureDir, exists } from "https://deno.land/std@0.224.0/fs/mod.ts"

interface Config {
  libraryPath: string
}

const CONFIG_DIR = join(Deno.env.get("HOME") || "~", ".library")
const CONFIG_FILE = join(CONFIG_DIR, "config.json")

export async function getConfig(): Promise<Config | null> {
  try {
    if (await exists(CONFIG_FILE)) {
      const content = await Deno.readTextFile(CONFIG_FILE)
      return JSON.parse(content)
    }
  } catch (error) {
    console.error("Error reading config:", error)
  }
  return null
}

export async function saveConfig(config: Config): Promise<void> {
  await ensureDir(CONFIG_DIR)
  await Deno.writeTextFile(CONFIG_FILE, JSON.stringify(config, null, 2))
}

export async function getLibraryPath(scriptPath: string): Promise<string> {
  const config = await getConfig()
  if (config?.libraryPath) {
    return config.libraryPath
  }

  const scriptDir = join(scriptPath, "..")
  const defaultPath = join(scriptDir, "library-content")
  return defaultPath
}
