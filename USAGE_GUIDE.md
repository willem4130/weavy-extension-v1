# Weavy Template Manager - Usage Guide

## 🚀 Quick Start

### Installation

1. **Build the extension:**
   ```bash
   cd weavy-template-manager
   npm install
   npm run build
   ```

2. **Load in Chrome:**
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist/` folder
   - The extension icon should appear in your toolbar

---

## 📋 How It Works

**Simple clipboard-based workflow:**

1. Copy nodes/edges JSON from Weavy.ai
2. Open extension → Click "New" → Paste JSON
3. Add name, description, tags → Save
4. Click template to copy JSON back to clipboard
5. Paste into Weavy.ai

**No Weavy.ai integration required!** Pure clipboard workflow.

---

## ✨ Features

### Create Templates
1. Click the extension icon in toolbar
2. Click "+ New" button
3. **Paste JSON** into the text area (from Weavy.ai)
4. **Add name** (required, min 3 characters)
5. Add description (optional)
6. Add tags (optional, press Enter to add)
7. Click "Save Template"

**JSON Format Required:**
```json
{
  "nodes": [...],
  "edges": [...]
}
```

### View Templates
- All templates displayed in grid layout
- Shows: name, description, tags, node/edge count, created date
- Click any template card to copy JSON to clipboard

### Copy Templates
**Two ways to copy:**
1. Click the template card (entire card is clickable)
2. Click the "📋 Copy to Clipboard" button

After copying, paste into Weavy.ai with `Ctrl+V` (or `Cmd+V` on Mac).

### Edit Templates
1. Click the "✏️ Edit" button on any template
2. Update name, description, or tags
3. Click "Update Template"

**Note:** You cannot edit the JSON data of existing templates. Create a new template instead.

### Delete Templates
1. Click the "🗑️ Delete" button on any template
2. Confirm deletion in the dialog
3. Template is permanently removed

### Search Templates
- Use the search bar at the top
- Searches template names and descriptions
- Real-time filtering (300ms debounce)

### Filter by Tags
1. Click the "Filter by Tags" dropdown
2. Select one or more tags
3. Templates matching ANY selected tag are shown
4. Click "Clear" to reset filters

### Sort Templates
- **Date (newest first)** - Default
- **Date (oldest first)**
- **Name (A-Z)**
- **Name (Z-A)**
- **Node Count (high to low)**

### Export Templates
1. Click "⚙️ Settings" button
2. Click "📥 Export All Templates"
3. Downloads `weavy-templates-YYYY-MM-DD.json` file
4. Save for backup or sharing

### Import Templates
1. Click "⚙️ Settings" button
2. Click "📤 Import Templates"
3. Select a JSON file (from previous export)
4. Templates are added to your collection
5. Toast shows success count

**Import Format:**
```json
{
  "version": "1.0.0",
  "exportDate": 1234567890,
  "templateCount": 10,
  "templates": [...]
}
```

### Clear All Templates
1. Click "⚙️ Settings" button
2. Click "🗑️ Clear All Templates"
3. Confirm in dialog
4. **All templates permanently deleted**

---

## 🎨 Interface Guide

### Main Screen
- **Header:** App name, template count, New/Settings buttons
- **Search Bar:** Search and filter controls
- **Template Grid:** All templates in cards
- **Footer:** Version info

### Template Card
- **Name** (large, bold)
- **Description** (if provided)
- **Tags** (colored chips)
- **Metadata:** X nodes, Y edges, created date
- **Actions:** Edit, Delete buttons
- **Copy:** Click card or button

### Create/Edit Form
- **JSON Input:** Large text area for pasting
- **Name:** Required text input
- **Description:** Optional text area
- **Tags:** Chip-based multi-input
- **Preview:** Shows node/edge count after JSON validation
- **Actions:** Save/Cancel buttons

### Settings Screen
- **Statistics:** Total templates, nodes, edges
- **Export:** Download all templates
- **Import:** Upload templates file
- **Clear All:** Delete everything
- **Info:** User ID, version

---

## ⌨️ Keyboard Shortcuts

- **Escape:** Close modals, cancel forms
- **Enter:** Submit forms, add tags
- **Tab:** Navigate between inputs
- **Click outside:** Close dropdowns

---

## 🎯 Tips & Best Practices

### Naming Templates
- Use descriptive names: "Image Enhancement Workflow"
- Not: "Template 1", "Test", "Untitled"

### Using Tags
- Keep tags short and consistent
- Examples: `image`, `video`, `3d`, `audio`, `composition`
- Use lowercase for consistency
- Max 10 tags per template

### Organizing Templates
- Use search for quick access
- Use tags for categorization
- Export regularly for backup

### JSON Validation
- Extension validates JSON structure
- Must have `nodes` and `edges` arrays
- Clear error messages if invalid
- Preview shows node/edge count

---

## 🔧 Troubleshooting

### Extension Not Loading
1. Check Chrome version (139+)
2. Enable Developer mode in `chrome://extensions`
3. Click "Reload" on extension card
4. Check for errors in console

### Templates Not Saving
1. Check JSON is valid
2. Name must be at least 3 characters
3. Check browser console for errors
4. Try reloading extension

### Copy Not Working
1. Chrome must be version 139+
2. Extension needs `clipboardWrite` permission
3. Try clicking the button instead of card
4. Check toast notification for errors

### Search Not Working
- Clear all filters first
- Check search query matches name or description
- Try removing search and filtering by tags instead

### Import Failing
- Ensure JSON file is from export feature
- Check file format matches export format
- See toast for how many failed
- Try importing smaller batches

---

## 📊 Data Storage

### Where Templates Are Stored
- **IndexedDB:** All template data
- **chrome.storage.local:** Extension settings only
- **Database:** `WeavyTemplates`
- **Location:** Browser profile folder

### Data Persistence
- ✅ Templates persist across browser restarts
- ✅ Templates persist when extension updates
- ✅ Independent of Chrome sync
- ❌ Not backed up automatically (use Export!)

### Privacy
- All data stored locally in your browser
- No cloud sync or external servers
- No tracking or analytics
- No data sent to third parties

---

## 🔄 Workflow Examples

### Example 1: Save Workflow
```
1. In Weavy.ai, select nodes and copy (Ctrl+C)
2. Open Weavy Template Manager
3. Click "+ New"
4. Paste JSON (Ctrl+V)
5. Name: "Remove Background + Upscale"
6. Tags: image, enhancement
7. Click "Save Template"
8. ✅ Template saved!
```

### Example 2: Use Template
```
1. Open Weavy Template Manager
2. Search for "upscale"
3. Click template card
4. Toast: "Copied to clipboard!"
5. In Weavy.ai, paste (Ctrl+V)
6. ✅ Workflow loaded!
```

### Example 3: Organize Templates
```
1. Create templates with consistent tags
2. Use search to find specific workflows
3. Filter by tag to see category
4. Export for backup
5. Share export file with team
```

---

## 🆘 Support

### Getting Help
- Check this guide first
- Review error messages in toasts
- Check browser console: `F12` → Console tab
- Reload extension if issues persist

### Reporting Issues
Include:
- Chrome version
- Extension version (v1.0.0)
- Steps to reproduce
- Console errors (if any)
- Template count (from Settings)

---

## 🎨 Dark Theme

The extension features a professional dark theme:
- **Background:** Deep grays (#1a1a1a, #242424)
- **Accent:** Indigo (#6366f1)
- **Text:** Light grays for readability
- **Consistent:** All components use same theme
- **Accessible:** High contrast, ARIA labels

---

## 📝 Version Information

**Version:** 1.0.0
**Manifest:** V3
**Chrome:** 139+
**React:** 19
**TypeScript:** Strict Mode

---

## 🚀 Future Features (Roadmap)

- [ ] Template folders/categories
- [ ] Duplicate template
- [ ] Template versioning
- [ ] Keyboard shortcuts for copy
- [ ] Template preview visualization
- [ ] Batch operations
- [ ] Cloud sync (optional)
- [ ] Template marketplace
- [ ] Collaboration features

---

**Enjoy managing your Weavy.ai templates! 🎉**
