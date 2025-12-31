# AppleScript/JXA UI Exploration Tips

## 1. Use `.description()` instead of `.name()` for toolbar buttons

Button names are often `null`, but descriptions work:

```javascript
const buttons = toolbar.buttons();
for (let i = 0; i < buttons.length; i++) {
  // buttons[i].name() returns null
  console.log(buttons[i].description()); // "Share", "Delete", etc.
}
```

## 2. Always use `delay()` after activating apps

UI elements may not be available immediately:

```javascript
voiceMemos.activate();
delay(0.5); // Wait for UI to settle

const vmProcess = systemEvents.processes["Voice Memos"];
```

## 3. Explore attributes, not just properties

File paths and URLs are often in attributes:

```javascript
const attrs = element.attributes();
for (let i = 0; i < attrs.length; i++) {
  const name = attrs[i].name();
  if (name.includes("URL") || name.includes("Path") || name === "AXFilename") {
    console.log(name + " = " + attrs[i].value());
  }
}
```

## 4. Build parent chains during traversal

Don't rely on `.parent()` - track parents as you search:

```javascript
function findElement(element, parentChain = [], depth = 0) {
  if (depth > 10) return null;

  if (/* found it */) {
    return {element: element, parents: parentChain};
  }

  const children = element.uiElements();
  for (let i = 0; i < children.length; i++) {
    const found = findElement(children[i], [...parentChain, element], depth + 1);
    if (found) return found;
  }

  return null;
}
```

## 5. Recursive UI exploration pattern

Safely explore deep UI hierarchies:

```javascript
function exploreUI(element, depth = 0) {
  if (depth > 8) return; // Prevent infinite recursion

  try {
    console.log("  ".repeat(depth) + element.role() + " - " + element.description());

    const children = element.uiElements();
    for (let i = 0; i < children.length; i++) {
      exploreUI(children[i], depth + 1);
    }
  } catch(e) {
    // Some elements throw errors - ignore them
  }
}
```

## 6. Find Share button and trigger it

Share menus are in toolbars, accessible via action:

```javascript
const toolbar = window.toolbars[0];
const shareButton = toolbar.buttons().find(b => b.description() === "Share");
shareButton.actions["AXPress"].perform();
```

## 7. Map all UI element types

Find what's available before searching:

```javascript
function countRoles(element, depth = 0) {
  if (depth > 8) return {};

  let counts = {};
  try {
    const role = element.role();
    counts[role] = (counts[role] || 0) + 1;

    element.uiElements().forEach(child => {
      const childCounts = countRoles(child, depth + 1);
      Object.entries(childCounts).forEach(([r, n]) => {
        counts[r] = (counts[r] || 0) + n;
      });
    });
  } catch(e) {}

  return counts;
}

// Usage
const roles = countRoles(window);
console.log("Tables: " + (roles["AXTable"] || 0));
console.log("Rows: " + (roles["AXRow"] || 0));
```

## 8. Check actions before assuming clicks work

Elements may have multiple actions:

```javascript
const actions = element.actions();
console.log("Available actions:");
for (let i = 0; i < actions.length; i++) {
  console.log("  " + actions[i].name());
}

// Then perform the right one
element.actions["AXPress"].perform();
```

## 9. Wrap everything in try-catch

UI elements are fragile and throw errors often:

```javascript
try {
  console.log("Name: " + el.name());
} catch(e) {
  console.log("Name: <error>");
}

try {
  console.log("Value: " + el.value());
} catch(e) {}
```

## 10. Search by text content, not structure

UI hierarchies vary; text content is more stable:

```javascript
function findByText(element, searchText, depth = 0) {
  if (depth > 10) return null;

  try {
    const value = element.value();
    if (value && value.includes(searchText)) {
      return element;
    }
  } catch(e) {}

  try {
    const children = element.uiElements();
    for (let i = 0; i < children.length; i++) {
      const found = findByText(children[i], searchText, depth + 1);
      if (found) return found;
    }
  } catch(e) {}

  return null;
}
```

## 11. Use Cmd+C to get file paths from clipboard

When UI elements don't expose file paths, copy them and extract from clipboard:

```javascript
ObjC.import("AppKit");
ObjC.import("Foundation");

const systemEvents = Application("System Events");

// Copy selected item (e.g., Voice Memo recording)
systemEvents.keystroke("c", {using: "command down"});
delay(0.5);

// Get file URL from clipboard
const pasteboard = $.NSPasteboard.generalPasteboard;
const fileURLString = pasteboard.stringForType($.NSPasteboardTypeFileURL);

if (fileURLString.js) {
  // Convert to NSURL and get POSIX path
  const url = $.NSURL.URLWithString(fileURLString);
  const path = ObjC.unwrap(url.path);

  console.log("File path: " + path);
  // Returns: /Users/name/Library/Containers/com.apple.VoiceMemos/Data/tmp/.../Recording.m4a
}
```

Complete workflow to export a file:

```bash
# Get file path from clipboard and copy to Downloads
FILEPATH=$(osascript -l JavaScript -e '
ObjC.import("AppKit");
ObjC.import("Foundation");
const pasteboard = $.NSPasteboard.generalPasteboard;
const fileURLString = pasteboard.stringForType($.NSPasteboardTypeFileURL);
const url = $.NSURL.URLWithString(fileURLString);
ObjC.unwrap(url.path);
')

cp "$FILEPATH" ~/Downloads/exported-file.m4a
```
