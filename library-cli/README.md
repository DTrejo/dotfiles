# Library - Knowledge Library Manager

A command-line tool to build a searchable knowledge library with support for YouTube video metadata, descriptions, chapters, and transcripts.

## Features

- 📹 Download video metadata without downloading the actual video
- 📝 Extract video transcripts (auto-generated or manual subtitles)
- 📚 Organize videos by date and title
- 🔍 Full-text search across all video content using `ripgrep`
- ⚡ Fast and lightweight

## Installation

### Prerequisites

1. **Deno** - [Install Deno](https://deno.land/manual/getting_started/installation)

2. **yt-dlp** - For downloading YouTube metadata:
   ```bash
   # macOS
   brew install yt-dlp

   # Or using pip
   pip install yt-dlp

   # Update if you already have it (important!)
   yt-dlp -U
   ```

3. **ripgrep** (for search) - Fast search tool:
   ```bash
   brew install ripgrep
   ```

### Setup

**Option 1: Install globally (recommended)**

```bash
cd library-cli
deno install --allow-read --allow-write --allow-env --allow-run --allow-net --name library --force main.ts
```

This installs the `library` command globally. You can now run `library` from anywhere.

**Option 2: Run directly from source**

```bash
cd library-cli
chmod +x main.ts
./main.ts --help
```

Or use the task:

```bash
deno task start --help
```

## Usage

### First Run

On first run, you'll be prompted to choose a library location:

```bash
./main.ts add
# Prompts: "Where should the library be stored? (default: ./library-content)"
```

The default location is `library-content/` as a sibling folder to `library-cli/`:

```
dotfiles/
  library-cli/       # The CLI tool
  library-content/   # Your video library (created on first run)
```

Configuration is saved to `~/.library/config.json`

### Add a Video

```bash
# With URL
library add https://www.youtube.com/watch?v=VIDEO_ID

# Or use short alias
library a https://www.youtube.com/watch?v=VIDEO_ID

# Interactive (prompts for URL)
library add
```

### Search Videos

```bash
# Search for content
library search "machine learning"

# Or use short alias
library s "machine learning"

# Interactive (prompts for query)
library search
```

### Get Help

```bash
library --help
library add --help
library search --help
```

## Library Structure

Videos are organized as:

```
library-content/
  2025-11-25/
    dasherized-video-title/
      Video Title.md          # Metadata, description, chapters
      transcript.md           # Full transcript with timestamps
```

### Example: Video Title.md

```markdown
# Understanding Neural Networks

**URL:** https://youtube.com/watch?v=...
**Uploaded:** 2025-11-20
**Duration:** 15:34

## Description

In this video, we explore...

## Table of Contents

- 00:00 - Introduction
- 02:15 - Main Topic
- 10:45 - Conclusion
```

### Example: transcript.md

```markdown
# Transcript

00:00:00 - Welcome to this video about neural networks...
00:00:15 - Today we'll discuss the fundamentals...
```

## How It Works

1. **yt-dlp** fetches video metadata without downloading the video:
   - Title, description, duration, upload date
   - Chapter markers (if available)
   - Subtitles/transcripts (auto-generated or manual)

2. **Storage** organizes content by date and dasherized title

3. **ripgrep** enables fast full-text search across all markdown files

## Notes

- **No videos are downloaded** - only metadata and text
- Transcripts use auto-generated subtitles when manual ones aren't available
- Videos without subtitles will have empty transcript files
- Duplicate detection prevents re-downloading the same video

## Troubleshooting

### "yt-dlp failed" or API errors

Your yt-dlp version might be outdated. Update it:

```bash
yt-dlp -U
# or
pip install -U yt-dlp
```

### "ripgrep is not installed"

Install ripgrep for search functionality:

```bash
brew install ripgrep
```

### Permission denied

Make sure the script is executable:

```bash
chmod +x bin/library
```

## Development

Run directly with Deno:

```bash
deno run --allow-all main.ts add https://youtube.com/watch?v=...
```

Or use the task:

```bash
deno task start add https://youtube.com/watch?v=...
```

To install locally for testing:

```bash
deno task install
```

## License

MIT
