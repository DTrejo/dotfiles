import { join } from "https://deno.land/std@0.224.0/path/mod.ts"
import { ensureDir } from "https://deno.land/std@0.224.0/fs/mod.ts"
import { dasherize, formatDate, formatDuration } from "./utils.ts"
import type { SubtitleLine, VideoInfo } from "./youtube.ts"

export async function saveVideo(
  libraryPath: string,
  videoInfo: VideoInfo,
  subtitles: SubtitleLine[],
): Promise<string> {
  const date = formatDate(new Date())
  const dasherizedTitle = dasherize(videoInfo.title)
  const videoDir = join(libraryPath, date, dasherizedTitle)

  await ensureDir(videoDir)

  await saveVideoMetadata(videoDir, videoInfo)

  if (subtitles.length > 0) {
    await saveTranscript(videoDir, subtitles)
  }

  return videoDir
}

async function saveVideoMetadata(videoDir: string, videoInfo: VideoInfo): Promise<void> {
  const metadataPath = join(videoDir, `${videoInfo.title}.md`)

  let content = `# ${videoInfo.title}\n\n`
  content += `**URL:** ${videoInfo.url}\n`
  content += `**Uploaded:** ${formatUploadDate(videoInfo.uploadDate)}\n`
  content += `**Duration:** ${formatDuration(videoInfo.duration)}\n\n`

  if (videoInfo.description) {
    content += `## Description\n\n${videoInfo.description}\n\n`
  }

  if (videoInfo.chapters && videoInfo.chapters.length > 0) {
    content += `## Table of Contents\n\n`
    for (const chapter of videoInfo.chapters) {
      const timestamp = formatTimestamp(chapter.startTime)
      content += `- ${timestamp} - ${chapter.title}\n`
    }
    content += "\n"
  }

  await Deno.writeTextFile(metadataPath, content)
}

async function saveTranscript(videoDir: string, subtitles: SubtitleLine[]): Promise<void> {
  const transcriptPath = join(videoDir, "transcript.md")

  let content = `# Transcript\n\n`

  for (const line of subtitles) {
    content += `${line.timestamp} - ${line.text}\n`
  }

  await Deno.writeTextFile(transcriptPath, content)
}

function formatUploadDate(uploadDate: string): string {
  if (!uploadDate || uploadDate.length !== 8) return uploadDate

  const year = uploadDate.substring(0, 4)
  const month = uploadDate.substring(4, 6)
  const day = uploadDate.substring(6, 8)

  return `${year}-${month}-${day}`
}

function formatTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${
      String(secs).padStart(2, "0")
    }`
  }
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
}

export async function checkVideExists(libraryPath: string, videoId: string): Promise<boolean> {
  try {
    for await (const dateEntry of Deno.readDir(libraryPath)) {
      if (!dateEntry.isDirectory) continue

      const datePath = join(libraryPath, dateEntry.name)
      for await (const videoEntry of Deno.readDir(datePath)) {
        if (!videoEntry.isDirectory) continue

        const videoPath = join(datePath, videoEntry.name)
        for await (const file of Deno.readDir(videoPath)) {
          if (file.name.endsWith(".md")) {
            const content = await Deno.readTextFile(join(videoPath, file.name))
            if (content.includes(videoId)) {
              return true
            }
          }
        }
      }
    }
  } catch {
    // Directory doesn't exist or other error
  }
  return false
}
