#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env --allow-run --allow-net

import { createCLI } from "./cli.ts"

const scriptDir = import.meta.dirname!

const cli = await createCLI(scriptDir)
await cli.parse(Deno.args)
