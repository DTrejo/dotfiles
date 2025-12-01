# PR Activity Report: Count Created and Merged by Day

This prompt generates a report showing how many PRs you created and merged on each day over the last 7 days, across all repositories.

## Prompt

```
How many PRs did I (a) create and (b) merge on each day in the last 7 days.

Use `gh` and search across ALL repositories (not just the current one).

Show the results:
1. Ordered chronologically by date (oldest to newest)
2. With correct day names (use `date` command to verify)
3. Merged view showing both created and merged PRs for each day
4. Include full PR details: repo name, PR number, title, and status
```

## Commands Used

### Get all PRs created in the last 7 days
```bash
gh search prs --author=@me --created=">=2025-11-14" --json number,title,repository,createdAt,closedAt,state,url --limit 100
```

### Get all PRs merged in the last 7 days
```bash
gh search prs --author=@me --merged-at=">=2025-11-14" --json number,title,repository,createdAt,closedAt,state,url --limit 100
```

### Verify day names for dates
```bash
for d in 2025-11-15 2025-11-16 2025-11-17 2025-11-18 2025-11-19 2025-11-20 2025-11-21; do
  echo "$d: $(date -j -f "%Y-%m-%d" "$d" "+%A")"
done
```

## Expected Output Format

### Per-Day Breakdown
```markdown
### **Monday, November 17** | Created: 3 | Merged: 2

**Created:**
- `repository-name` #123: "PR title" ✅ merged Nov 19
- `repository-name` #124: "PR title" 🔵 open
- `repository-name` #125: "PR title" ❌ closed

**Merged:**
- `repository-name` #120: "PR title" (created Nov 16)
- `repository-name` #121: "PR title" (created same day)
```

### Summary Table
```markdown
| Date    | Day       | Created | Merged | Net Change |
|---------|-----------|---------|--------|------------|
| Nov 15  | Saturday  | 0       | 0      | 0          |
| Nov 16  | Sunday    | 2       | 0      | +2         |
| Nov 17  | Monday    | 3       | 2      | +1         |
| **Total** |         | **15** | **11** | **+4**     |
```

## Status Icons
- ✅ merged
- 🔵 open
- ❌ closed (without merge)

## Notes

- Change the date in `--created=">="` and `--merged-at=">="` to adjust the time window
- The `--limit` can be adjusted if you have more PRs to fetch
- The `gh search prs` command searches across ALL repositories you have access to
- Use `closedAt` field to determine merge dates (when state is "merged")
