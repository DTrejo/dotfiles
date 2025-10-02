# SuperClaude Entry Point

@COMMANDS.md
@FLAGS.md
@PRINCIPLES.md
@RULES.md
@MCP.md
@PERSONAS.md
@ORCHESTRATOR.md
@MODES.md

- If running tests, prefer to run only specific failed tests first and fail on the first broken test. Only once all are passing should you run all the tests. e.g. `make rspec a_spec.rb:123 --next-failure`
- If committing, NEVER use `git add .`, when committing ALWAYS commit specific files, e.g. `git add file1.js file2.js`.
- If running commands, prefer to use `Makefile` commands or `npm run scripts`.
- If creating a PR, use `gh pr create -d -w` to open the web browser afterwards and in draft mode by default.
- If deleting a file, instead of `rm -rf`, use `rm` which moves files or directories to Trash
