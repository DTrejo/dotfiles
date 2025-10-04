#!/bin/bash

# Read JSON input once
input=$(cat)

# Helper functions
get_model_name() { echo "$input" | jq -r '.model.display_name'; }
get_current_dir() { echo "$input" | jq -r '.workspace.current_dir'; }
get_cost() { echo "$input" | jq -r '.cost.total_cost_usd // empty'; }

# Extract data
model_name=$(get_model_name)
current_dir=$(get_current_dir)
cost=$(get_cost)

# Parse prettier model name (e.g., "sonnet-4-5" -> "sonnet 4.5")
if [[ "$model_name" =~ sonnet-([0-9])-([0-9]) ]]; then
    model_display="sonnet ${BASH_REMATCH[1]}.${BASH_REMATCH[2]}"
elif [[ "$model_name" =~ opus ]]; then
    model_display="opus"
elif [[ "$model_name" =~ haiku ]]; then
    model_display="haiku"
else
    model_display="${model_name,,}"
fi

# Convert to relative path from home (like %~ in zsh)
relative_dir="${current_dir/#$HOME/~}"

# Get git branch (like gb function)
git_branch=""
if git -C "$current_dir" rev-parse --git-dir > /dev/null 2>&1; then
    git_branch=$(git -C "$current_dir" --no-optional-locks branch --show-current 2>/dev/null || echo "")
fi

# Build status line matching your prompt style
# Reset color at the start for a clean baseline
status="$(printf '\033[0m')"

# Model name with cost
if [ -n "$cost" ] && [ "$cost" != "null" ] && [ "$cost" != "0" ]; then
    # Round to whole dollars
    cost_rounded=$(printf "%.0f" "$cost")
    model_display="${model_display} $(printf '\033[32m$%s\033[0m' "$cost_rounded")"
fi
status="${status}$(printf '\033[36m%s\033[0m' "$model_display")"

# Relative path
status="${status} ${relative_dir}"

# Yellow git branch in parens (like your prompt)
if [ -n "$git_branch" ]; then
    status="${status}$(printf '\033[33m(%s)\033[0m' "$git_branch")"
fi

# AI emoji separator - options: 🤖 ✨ 🧠 ⚡ 🔮
status="${status} 🤖"

echo "$status"
