import { bold, cyan, dim, green } from "https://deno.land/std@0.224.0/fmt/colors.ts"

export async function checkRipgrepInstalled(): Promise<boolean> {
  try {
    const command = new Deno.Command("which", {
      args: ["rg"],
      stdout: "piped",
      stderr: "piped",
    })
    const { code } = await command.output()
    return code === 0
  } catch {
    return false
  }
}

export async function searchLibrary(
  query: string,
  libraryPath: string,
): Promise<void> {
  const isInstalled = await checkRipgrepInstalled()

  if (!isInstalled) {
    console.error("❌ 'ripgrep' (rg) is not installed.")
    console.error("Install it with: brew install ripgrep")
    Deno.exit(1)
  }

  // Use ripgrep with formatting
  const command = new Deno.Command("rg", {
    args: [
      "--ignore-case", // Case insensitive
      "--heading", // Group by file
      "--line-number", // Show line numbers
      "--color",
      "never", // No ANSI colors (we'll format ourselves)
      "--max-columns",
      "150", // Limit line length
      "--max-columns-preview", // Show preview even if line is long
      query,
      libraryPath,
    ],
    stdout: "piped",
    stderr: "piped",
  })

  const { code, stdout, stderr } = await command.output()

  if (code !== 0) {
    const errorText = new TextDecoder().decode(stderr)
    if (errorText.includes("No matches found") || code === 1) {
      console.log(dim("\nNo results found.\n"))
      return
    }
    console.error("Search failed:", errorText)
    Deno.exit(code)
  }

  const output = new TextDecoder().decode(stdout)
  formatSearchResults(output, query)
}

function formatSearchResults(output: string, query: string): void {
  const lines = output.trim().split("\n")
  let currentFile = ""
  let resultCount = 0

  console.log() // Blank line before results

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // File headers (no colon, just the path)
    if (!line.includes(":") && line.trim().length > 0) {
      if (currentFile) console.log() // Blank line between files
      currentFile = line
      const displayPath = line.replace(Deno.env.get("HOME") || "", "~")
      console.log(bold(green("📄 " + displayPath)))
      continue
    }

    // Match lines (line_number:content)
    const match = line.match(/^(\d+):(.*)$/)
    if (match) {
      resultCount++
      const lineNum = match[1]
      const content = match[2]

      // Highlight the query term in the content
      const highlighted = highlightQuery(content, query)
      console.log(dim(`   ${lineNum}:`) + " " + highlighted)
    }
  }

  console.log()
  console.log(dim(`Found ${resultCount} matches`))
  console.log()
}

function highlightQuery(text: string, query: string): string {
  // Case-insensitive highlighting
  const regex = new RegExp(`(${query})`, "gi")
  return text.replace(regex, cyan(bold("$1")))
}
