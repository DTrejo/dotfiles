import { extractVideoId } from "./utils.ts"

export interface VideoInfo {
  id: string
  title: string
  description: string
  uploadDate: string
  duration: number
  url: string
  chapters?: Chapter[]
}

export interface Chapter {
  title: string
  startTime: number
  endTime: number
}

export interface SubtitleLine {
  timestamp: string
  text: string
}

export async function checkYtDlpInstalled(): Promise<boolean> {
  try {
    const command = new Deno.Command("which", {
      args: ["yt-dlp"],
      stdout: "piped",
      stderr: "piped",
    })
    const { code } = await command.output()
    return code === 0
  } catch {
    return false
  }
}

export async function fetchVideoInfo(url: string): Promise<VideoInfo> {
  const videoId = extractVideoId(url)
  if (!videoId) {
    throw new Error("Invalid YouTube URL")
  }

  const command = new Deno.Command("yt-dlp", {
    args: [
      "--dump-json",
      "--skip-download",
      "--no-warnings",
      url,
    ],
    stdout: "piped",
    stderr: "piped",
  })

  const { code, stdout, stderr } = await command.output()

  if (code !== 0) {
    const errorText = new TextDecoder().decode(stderr)
    throw new Error(`yt-dlp failed: ${errorText}`)
  }

  const json = JSON.parse(new TextDecoder().decode(stdout))

  const chapters: Chapter[] = json.chapters?.map((ch: any) => ({
    title: ch.title,
    startTime: ch.start_time,
    endTime: ch.end_time,
  })) || []

  return {
    id: json.id,
    title: json.title,
    description: json.description || "",
    uploadDate: json.upload_date || "",
    duration: json.duration || 0,
    url,
    chapters: chapters.length > 0 ? chapters : undefined,
  }
}

export async function fetchSubtitles(url: string, tempDir: string): Promise<SubtitleLine[]> {
  const command = new Deno.Command("yt-dlp", {
    args: [
      "--skip-download",
      "--write-auto-subs",
      "--sub-lang",
      "en",
      "--sub-format",
      "json3",
      "--output",
      `${tempDir}/%(id)s.%(ext)s`,
      "--no-warnings",
      url,
    ],
    stdout: "piped",
    stderr: "piped",
  })

  const { code } = await command.output()

  if (code !== 0) {
    return []
  }

  try {
    const files = []
    for await (const entry of Deno.readDir(tempDir)) {
      if (entry.name.endsWith(".json3")) {
        files.push(entry.name)
      }
    }

    if (files.length === 0) {
      return []
    }

    const json3Content = await Deno.readTextFile(`${tempDir}/${files[0]}`)
    return parseJSON3(json3Content)
  } catch {
    return []
  }
}

function parseJSON3(json3Content: string): SubtitleLine[] {
  const lines: SubtitleLine[] = []

  try {
    const data = JSON.parse(json3Content)

    if (!data.events) return []

    for (const event of data.events) {
      if (!event.segs) continue

      const startMs = event.tStartMs || 0
      const timestamp = formatTimestamp(startMs)

      const words = event.segs
        .map((seg: any) => seg.utf8 || "")
        .join("")
        .trim()

      if (words) {
        lines.push({ timestamp, text: words })
      }
    }
  } catch {
    return []
  }

  return lines
}

function formatTimestamp(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${
      String(seconds).padStart(2, "0")
    }`
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}
