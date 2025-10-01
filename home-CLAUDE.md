# SuperClaude Entry Point

@COMMANDS.md
@FLAGS.md
@PRINCIPLES.md
@RULES.md
@MCP.md
@PERSONAS.md
@ORCHESTRATOR.md
@MODES.md

- Always prefer to run only specific failed tests first. Only once all are passing should you run all the tests.
- NEVER use `git add .`, when committing ALWAYS commit specific files, e.g. `git add file1.js file2.js`.
- Prefer to use `Makefile` commands or `npm run scripts`.
- When using `gh pr create`, always use `gh pr create -d -w` to open the web browser afterwards and in draft mode by default.
- Instead of `rm -rf`, use `rm` which is aliased to support moving directories and files to Trash.
