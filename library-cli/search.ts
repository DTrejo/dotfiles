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

  // Use ripgrep with its native formatting and colors
  const command = new Deno.Command("rg", {
    args: [
      "--ignore-case", // Case insensitive
      "--heading", // Group by file
      "--line-number", // Show line numbers
      "--color",
      "always", // Enable colors
      "--max-columns",
      "150", // Limit line length
      "--max-columns-preview", // Show preview even if line is long
      query,
      libraryPath,
    ],
    stdout: "inherit",
    stderr: "inherit",
  })

  const { code } = await command.output()

  if (code !== 0 && code !== 1) {
    Deno.exit(code)
  }
}
