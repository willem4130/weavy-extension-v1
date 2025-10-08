# Testing Weavy Extension V2.0

## 🚀 Quick Start

### 1. Open Chrome Extensions Page
```
chrome://extensions/
```

Or: Chrome Menu (⋮) → Extensions → Manage Extensions

### 2. Enable Developer Mode
- Toggle "Developer mode" switch in the top-right corner

### 3. Load the Extension
1. Click "Load unpacked" button
2. Navigate to: `/Users/willemvandenberg/Weavy1/weavy-template-manager/dist`
3. Click "Select" to load the extension

### 4. Verify Installation
You should see:
- ✅ Extension card: "Weavy Template Manager" v2.0.0
- ✅ No errors in the card
- ✅ Extension icon in Chrome toolbar

## 🧪 Testing Checklist

### Basic Functionality

#### Opening the Side Panel
- [ ] Click the extension icon in Chrome toolbar
- [ ] Side panel opens on the right side
- [ ] Try keyboard shortcut: `Ctrl+Shift+W` (Windows) or `Cmd+Shift+W` (Mac)
- [ ] Side panel should toggle open/close

#### Panel Persistence
- [ ] Open side panel
- [ ] Click somewhere in the browser (outside panel)
- [ ] Side panel should STAY OPEN (not close like old popup)
- [ ] Navigate to different website
- [ ] Side panel should STAY OPEN
- [ ] Only closes when you manually click the X or press shortcut again

#### Full-Height Layout
- [ ] Side panel should extend full browser height
- [ ] No fixed 600px height anymore
- [ ] Content scrollable if needed
- [ ] Looks professional and spacious

### Template Operations

#### Create Template
1. [ ] Click "+ New" button
2. [ ] Fill in template name
3. [ ] Add description (optional)
4. [ ] Paste JSON in the data field (use sample below)
5. [ ] Add tags (optional)
6. [ ] Click "Save Template"
7. [ ] Should see success toast
8. [ ] Should return to template list

#### View Templates
- [ ] Templates display in cards
- [ ] Each card shows:
  - Template name
  - Description
  - Node/edge count badges
  - **NEW: Size badge with color indicator**
  - Creation date
  - Tags
- [ ] Size badges show:
  - 🟢 Green for small (<100KB)
  - 🔵 Blue for medium (100KB-1MB)
  - 🟠 Orange for large (1-10MB)
  - 🔴 Red for huge (>10MB)

#### Edit Template
- [ ] Click edit button (✏️) on a template
- [ ] Can modify name, description, tags
- [ ] Click "Save" to update
- [ ] Changes reflected in list

#### Delete Template
- [ ] Click delete button (🗑️)
- [ ] Confirmation dialog appears
- [ ] Click "Delete" to confirm
- [ ] Template removed from list

#### Copy Template
- [ ] Click "Copy to Clipboard" button
- [ ] Success toast appears
- [ ] Paste in text editor to verify JSON copied

### Search & Filter

- [ ] Type in search box
- [ ] Results filter in real-time (300ms debounce)
- [ ] Search works on name and description
- [ ] Clear search with X button

### Settings Page

- [ ] Click settings button (⚙️)
- [ ] View statistics:
  - Template count
  - Total nodes
  - Total edges
- [ ] Export templates to JSON file
- [ ] Import templates from JSON file
- [ ] "Back" button returns to list

### Modern Theme

- [ ] Dark theme with richer blacks (#09090b)
- [ ] Indigo accent color (#6366f1)
- [ ] Higher contrast text
- [ ] Smooth hover effects on cards
- [ ] Professional appearance

## 📊 Sample Template JSON

Use this for testing:

```json
{
  "nodes": [
    {"id": "1", "type": "start", "data": {"label": "Start"}, "position": {"x": 0, "y": 0}},
    {"id": "2", "type": "process", "data": {"label": "Process"}, "position": {"x": 100, "y": 100}},
    {"id": "3", "type": "end", "data": {"label": "End"}, "position": {"x": 200, "y": 200}}
  ],
  "edges": [
    {"id": "e1-2", "source": "1", "target": "2"},
    {"id": "e2-3", "source": "2", "target": "3"}
  ]
}
```

## 🐛 Known Issues / Notes

1. **Tags Feature** - May have issues (flagged for investigation)
2. **Size Indicators** - Should now show on template cards
3. **First Load** - May take a moment to initialize IndexedDB

## 🔍 Checking for Errors

### 1. Extension Errors
- Go to `chrome://extensions/`
- Look for red "Errors" button on extension card
- Click to view any errors

### 2. Service Worker Console
- Go to `chrome://extensions/`
- Click "service worker" link on extension card
- Check console for errors

### 3. Side Panel Console
- Open side panel
- Right-click inside panel → "Inspect"
- Check console for errors

## ✨ New Features to Verify

### V2.0 Improvements:
1. ✅ **Persistent side panel** - stays open during browsing
2. ✅ **Full-height layout** - better use of screen space
3. ✅ **Unlimited storage** - no size limits
4. ✅ **Size monitoring** - visual indicators for template sizes
5. ✅ **Modern theme** - shadcn-inspired design
6. ✅ **Keyboard shortcut** - quick toggle

## 📝 Feedback Notes

When testing, note:
- Any errors or crashes
- UI/UX issues
- Performance with multiple templates
- Size badge accuracy
- Side panel behavior
- Anything that looks "off"

## 🎯 Success Criteria

Extension is working if:
- ✅ Side panel opens and stays open
- ✅ Can create/edit/delete templates
- ✅ Size badges appear on templates
- ✅ Search and filters work
- ✅ Export/import functions work
- ✅ No console errors
- ✅ Modern dark theme applied

---

**Ready to Test!** The extension is built and ready in the `dist/` folder.
