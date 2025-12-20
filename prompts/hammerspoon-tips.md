# Hammerspoon Development Tips

## Remote Reloading

### Preferred: `hs` CLI

Enable IPC in init.lua:
```lua
require("hs.ipc")
```

Reload (exit code 69 is normal - connection drops during reload):
```bash
hs -c "hs.reload()"
```

### Fallback: AppleScript

Enable in init.lua:
```lua
hs.allowAppleScript(true)
```

Reload:
```bash
osascript -e 'tell application "Hammerspoon" to execute lua code "hs.reload()"'
```

## Debugging

Log to Hammerspoon console (menu bar → Console). One log per event:
```lua
print("[MyScript] Check: badge=" .. badge)
```

## Running External Scripts

Task callback receives `exitCode, stdOut, stdErr`. Ruby `puts` → stdOut, osascript `console.log()` → stdErr:
```lua
local task = hs.task.new("/bin/zsh", function(exitCode, stdOut, stdErr)
  local result = (stdOut or ""):gsub("%s+", "")
end, {"-lc", "/path/to/script"})
task:start()
```

## Menu Bar Icons

```lua
local menu = hs.menubar.new()
menu:setTitle(hs.styledtext.new("✱", {
  color = {hex = "#FFFFFF"},  -- use #808080 for inactive
  font = {size = 14}
}))
```

## Timers

```lua
local timer = hs.timer.doEvery(5, checkFunction)

-- Stop before starting new to avoid duplicates
if animationTimer then
  animationTimer:stop()
end
animationTimer = hs.timer.doEvery(0.25, animateFunction)
```

## App Watchers

**Important:** Anything long-running (watchers, timers, tasks) declared with `local` gets garbage collected when it goes out of scope. Either remove `local` (make global) or store a reference somewhere persistent.

React to focus changes:
```lua
local appWatcher = hs.application.watcher.new(function(appName, eventType, app)
  if appName == "iTerm2" and eventType == hs.application.watcher.activated then
    hideIndicator()
  end
end)
appWatcher:start()
```

Check frontmost app:
```lua
local frontApp = hs.application.frontmostApplication()
if frontApp and frontApp:name() == "iTerm2" then ... end
```

## Hotkeys

```lua
hs.hotkey.bind({"ctrl"}, "`", function()
  print("Hotkey pressed!")
end)

-- Modifiers: cmd, alt, ctrl, shift
hs.hotkey.bind({"cmd", "shift"}, "t", myFunction)
```

## Alerts

```lua
hs.alert.show("Hello!")      -- show popup
hs.alert.closeAll()          -- dismiss all alerts
```

## Simulating Keystrokes

```lua
hs.eventtap.keyStroke({"cmd"}, "v")  -- Cmd+V (paste)
hs.eventtap.keyStroke({}, "space")   -- Space
```

## Wrapping CLI Tools

An easy way to add UI to a CLI tool: display the last line of output in a menu bar item and/or alert. Combine streaming task output with dynamic menu items.

## Streaming Task Output

Use third callback for real-time output (e.g., progress updates):
```lua
local function onStreaming(task, stdout, stderr)
  local line = stdout or stderr
  print("Output: " .. (line or ""))
  return true  -- keep streaming
end

local function onExit(exitCode, stdOut, stdErr)
  print("Done!")
end

task = hs.task.new("/bin/zsh", onExit, onStreaming, {"-lc", "/path/to/script"})
task:start()
```

Send input to running task:
```lua
task:setInput(" ")  -- send space/enter to stop recording, etc.
```

## Dynamic Menu Bar Items

Create/delete menu bar items on demand:
```lua
local menu = nil

local function showMenu(text)
  if not menu then menu = hs.menubar.new() end
  menu:setTitle(text)
end

local function hideMenu()
  if menu then
    menu:delete()
    menu = nil
  end
end
```

## Animation

```lua
local frames = {"✱", "✲", "✳", "✴"}
local frameIndex = 0

local function animate()
  frameIndex = (frameIndex % #frames) + 1
  setMenuTitle(frames[frameIndex])
end

-- Start animation
animationTimer = hs.timer.doEvery(0.25, animate)

-- Stop animation
if animationTimer then
  animationTimer:stop()
  animationTimer = nil
end
```
