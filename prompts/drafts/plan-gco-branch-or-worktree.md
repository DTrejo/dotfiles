# Smart `gco` - Checkout Branch or CD to Worktree

## The Problem

When a branch is already checked out in a git worktree, attempting to check it out fails:

```bash
$ git checkout some-plan
fatal: 'some-plan' is already used by worktree at '/Users/user/.cursor/worktrees/repo/cew'
```

We want `gco` to automatically cd to the worktree instead.

## Recommended Solution: Check-First Approach

```zsh
gco() {
  local p=$(git worktree list --porcelain | awk -v b="$1" '
    /^worktree / { w = $2 }
    /^branch / { gsub(/refs\/heads\//, "", $2); if ($2 == b) print w }
  ')
  [[ $p ]] && cd "$p" || git checkout "$@"
}
```

### Why This is Best

1. **Simplest** - No error handling, no output capturing, just one check
2. **Fast** - `git worktree list` reads local files (essentially free)
3. **Robust** - Works with all `git checkout` arguments (`-b`, `-`, file paths, etc.)
4. **No edge cases** - Uses porcelain format (stable, machine-readable)
5. **4 lines** - Minimal cognitive overhead

### With Helpful Output

```zsh
gco() {
  local p=$(git worktree list --porcelain | awk -v b="$1" '
    /^worktree / { w = $2 }
    /^branch / { gsub(/refs\/heads\//, "", $2); if ($2 == b) print w }
  ')
  [[ $p ]] && { echo "→ $p"; cd "$p"; } || git checkout "$@"
}
```

## Alternative: Checkout-First Approach

Try checkout first, fall back to worktree cd only on error:

```zsh
gco() {
  local branch="$1"
  [[ -z "$branch" ]] && { git checkout; return $?; }

  local out=$(git checkout "$@" 2>&1)
  local code=$?

  if [[ $code -eq 0 ]]; then
    echo "$out"
  elif echo "$out" | grep -q "is already used by worktree at"; then
    local path=$(git worktree list --porcelain | awk -v b="$branch" '
      /^worktree / {p=$2}
      /^branch / {gsub(/refs\/heads\//, "", $2); if ($2==b) {print p; exit}}
    ')
    if [[ -n "$path" ]] && [[ -d "$path" ]]; then
      echo "→ $branch worktree: $path"
      cd "$path"
    else
      echo "$out"; return $code
    fi
  else
    echo "$out"; return $code
  fi
}
```

**Trade-offs:**
- Pro: Shows all git checkout error messages naturally
- Con: More complex code (error handling, output capture)
- Con: Slower for the common case (switching between existing worktrees)

## Why Not Ruby or Node?

### Ruby Version
```ruby
#!/usr/bin/env ruby
branch = ARGV[0]
worktrees = `git worktree list --porcelain`.split("\n\n")
path = worktrees.find { |wt| wt.include?("refs/heads/#{branch}") }&.lines&.first&.split(' ', 2)&.last&.strip

if path
  puts "cd #{path}"
else
  system('git', 'checkout', *ARGV)
end
```

Usage: `eval $(gco branch)`

### Comparison

| Aspect | Zsh | Ruby | Node |
|--------|-----|------|------|
| Lines | 5 | 16+ | 20+ |
| Startup | ~0ms | 50-100ms | 100-200ms |
| Dependencies | Built-in | Built-in | npm install shelljs |
| Shell integration | Native cd | Must eval or spawn | Must eval or spawn |
| Argument passing | Perfect | Needs escaping | Needs escaping |

**Verdict:** Native shell functions win for shell operations. Ruby/Node add complexity and latency without benefit.

## Installation

Add the recommended function to `~/.zshrc`:

```zsh
# Smart checkout - cd to worktree if branch is already checked out there
gco() {
  local p=$(git worktree list --porcelain | awk -v b="$1" '
    /^worktree / { w = $2 }
    /^branch / { gsub(/refs\/heads\//, "", $2); if ($2 == b) print w }
  ')
  [[ $p ]] && { echo "→ $p"; cd "$p"; } || git checkout "$@"
}
```

Then: `source ~/.zshrc`

## Usage Examples

```bash
# Branch in a worktree - cd to it
$ gco some-plan
→ /Users/user/.cursor/worktrees/repo/cew

# Regular checkout - works normally
$ gco main
Switched to branch 'main'

# Create new branch - passes through
$ gco -b new-feature
Switched to a new branch 'new-feature'

# All git checkout args work
$ gco -
$ gco HEAD~1 -- file.txt
```
