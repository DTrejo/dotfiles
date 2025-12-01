import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts"

Deno.test("library --help should display help", async () => {
  const command = new Deno.Command("deno", {
    args: ["run", "--allow-all", "main.ts", "--help"],
    stdout: "piped",
    stderr: "piped",
  })

  const { code, stdout } = await command.output()
  const output = new TextDecoder().decode(stdout)

  assertEquals(code, 0)
  assertEquals(output.includes("Knowledge library manager"), true)
  assertEquals(output.includes("add"), true)
  assertEquals(output.includes("search"), true)
})

Deno.test("library --version should display version", async () => {
  const command = new Deno.Command("deno", {
    args: ["run", "--allow-all", "main.ts", "--version"],
    stdout: "piped",
    stderr: "piped",
  })

  const { code, stdout } = await command.output()
  const output = new TextDecoder().decode(stdout)

  assertEquals(code, 0)
  assertEquals(output.includes("1.0.0"), true)
})

Deno.test("library add --help should display add command help", async () => {
  const command = new Deno.Command("deno", {
    args: ["run", "--allow-all", "main.ts", "add", "--help"],
    stdout: "piped",
    stderr: "piped",
  })

  const { code, stdout } = await command.output()
  const output = new TextDecoder().decode(stdout)

  assertEquals(code, 0)
  assertEquals(output.includes("metadata only"), true)
})

Deno.test("library search --help should display search command help", async () => {
  const command = new Deno.Command("deno", {
    args: ["run", "--allow-all", "main.ts", "search", "--help"],
    stdout: "piped",
    stderr: "piped",
  })

  const { code, stdout } = await command.output()
  const output = new TextDecoder().decode(stdout)

  assertEquals(code, 0)
  assertEquals(output.includes("Search the library"), true)
})

Deno.test("library a (alias) --help should display add command help", async () => {
  const command = new Deno.Command("deno", {
    args: ["run", "--allow-all", "main.ts", "a", "--help"],
    stdout: "piped",
    stderr: "piped",
  })

  const { code, stdout } = await command.output()
  const output = new TextDecoder().decode(stdout)

  assertEquals(code, 0)
  assertEquals(output.includes("metadata only"), true)
})

Deno.test("library s (alias) --help should display search command help", async () => {
  const command = new Deno.Command("deno", {
    args: ["run", "--allow-all", "main.ts", "s", "--help"],
    stdout: "piped",
    stderr: "piped",
  })

  const { code, stdout } = await command.output()
  const output = new TextDecoder().decode(stdout)

  assertEquals(code, 0)
  assertEquals(output.includes("Search the library"), true)
})
