import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts"
import { Confirm, Input } from "https://deno.land/x/cliffy@v0.25.7/prompt/mod.ts"
import { join, resolve } from "https://deno.land/std@0.224.0/path/mod.ts"
import { ensureDir, exists } from "https://deno.land/std@0.224.0/fs/mod.ts"
import { bold, cyan, dim, green } from "https://deno.land/std@0.224.0/fmt/colors.ts"
import { checkYtDlpInstalled, fetchSubtitles, fetchVideoInfo } from "./youtube.ts"
import { checkVideExists, saveVideo } from "./storage.ts"
import { searchLibrary } from "./search.ts"
import { getConfig, getLibraryPath, saveConfig } from "./config.ts"

async function initializeLibraryPath(scriptDir: string): Promise<string> {
  let config = await getConfig()

  if (!config) {
    const dotfilesDir = resolve(join(scriptDir, ".."))
    const defaultPath = resolve(join(dotfilesDir, "library-content"))

    console.log("First time setup!")
    const libraryPath = await Input.prompt({
      message: "Where should the library be stored?",
      default: defaultPath,
    })

    const absolutePath = resolve(libraryPath)
    await saveConfig({ libraryPath: absolutePath })
    await ensureDir(absolutePath)

    console.log(`✓ Library initialized at: ${absolutePath}\n`)
    return absolutePath
  }

  if (!await exists(config.libraryPath)) {
    await ensureDir(config.libraryPath)
  }

  return config.libraryPath
}

async function addCommand(
  url: string | undefined,
  scriptDir: string,
  overwrite = false,
): Promise<void> {
  const isInstalled = await checkYtDlpInstalled()
  if (!isInstalled) {
    console.error("❌ 'yt-dlp' is not installed.")
    console.error("Install it with:")
    console.error("  brew install yt-dlp")
    console.error("  OR")
    console.error("  pip install yt-dlp")
    Deno.exit(1)
  }

  const libraryPath = await initializeLibraryPath(scriptDir)

  if (!url) {
    url = await Input.prompt({
      message: "Enter YouTube URL:",
    })
  }

  console.log(dim("\nFetching video metadata..."))

  try {
    const videoInfo = await fetchVideoInfo(url)

    const alreadyExists = await checkVideExists(libraryPath, videoInfo.id)
    if (alreadyExists && !overwrite) {
      const shouldOverwrite = await Confirm.prompt({
        message: `Video "${videoInfo.title}" already exists in library. Download again?`,
        default: false,
      })

      if (!shouldOverwrite) {
        console.log("\nSkipped.\n")
        return
      }
    }

    console.log(green("✓") + " " + bold("Title:") + " " + videoInfo.title)

    const tempDir = await Deno.makeTempDir()
    try {
      const savedPath = await saveVideo(libraryPath, videoInfo, [])
      const displayPath = savedPath.replace(Deno.env.get("HOME") || "", "~")
      const metadataFilename = `${videoInfo.title}.md`
      console.log(
        green("✓") + " " + bold("Description and table of contents:") + " " +
          dim(displayPath + "/" + metadataFilename),
      )

      const subtitles = await fetchSubtitles(url, tempDir)

      if (subtitles.length === 0) {
        console.log(green("✓") + " " + bold("Transcript:") + " " + "No transcript available")
      } else {
        const lineCount = subtitles.length >= 1000
          ? `${Math.round(subtitles.length / 1000)}k`
          : subtitles.length.toString()
        console.log(green("✓") + " " + bold("Transcript:") + " " + cyan(`${lineCount} lines`))

        await saveVideo(libraryPath, videoInfo, subtitles)
      }

      console.log()
    } finally {
      await Deno.remove(tempDir, { recursive: true })
    }
  } catch (error) {
    console.error(`\nError: ${error.message}\n`)
    Deno.exit(1)
  }
}

async function searchCommand(query: string | undefined, scriptDir: string): Promise<void> {
  const libraryPath = await initializeLibraryPath(scriptDir)

  if (!query) {
    query = await Input.prompt({
      message: "Enter search query:",
    })
  }

  await searchLibrary(query, libraryPath)
}

export async function createCLI(scriptDir: string): Promise<Command> {
  const cli = new Command()
    .name("library")
    .version("1.0.0")
    .description("Knowledge library manager with support for YouTube full-text search")
    .action(function () {
      this.showHelp()
    })

  cli
    .command("add [url:string]")
    .alias("a")
    .description("Add a YouTube video to the library (metadata only, video not downloaded)")
    .option("--overwrite", "Overwrite existing video without prompting")
    .action(async (options, url) => {
      await addCommand(url, scriptDir, options.overwrite)
    })

  cli
    .command("search [query:string]")
    .alias("s")
    .description("Search the library (video titles, descriptions, transcripts)")
    .action(async (_options, query) => {
      await searchCommand(query, scriptDir)
    })

  return cli
}
