# Testing Checklist - Weavy Template Manager

## 🔍 Pre-Testing Setup

- [ ] Extension built: `npm run build`
- [ ] Loaded in Chrome: `chrome://extensions` → Load unpacked → `dist/`
- [ ] No errors in `chrome://extensions`
- [ ] Extension icon visible in toolbar
- [ ] Chrome DevTools open: Right-click extension → Inspect

---

## ✅ Core Functionality Tests

### Extension Loading
- [ ] Extension loads without errors
- [ ] Service worker status: Active (green)
- [ ] Popup opens when clicking icon
- [ ] No console errors on popup open
- [ ] Dark theme applied correctly

### Create Template Flow
- [ ] Click "+ New" button
- [ ] Paste valid JSON in text area
- [ ] JSON validation works (shows node/edge count)
- [ ] Invalid JSON shows error message
- [ ] Name input required (min 3 chars)
- [ ] Description optional
- [ ] Tags can be added (press Enter)
- [ ] Tags can be removed (click X)
- [ ] Max 10 tags enforced
- [ ] "Save Template" creates template
- [ ] Returns to list view after save
- [ ] Toast notification shows success
- [ ] Template appears in list

**Test JSON:**
```json
{
  "nodes": [
    {
      "id": "test-1",
      "type": "image",
      "position": {"x": 0, "y": 0},
      "data": {}
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "test-1",
      "target": "test-2",
      "sourceHandle": "out",
      "targetHandle": "in"
    }
  ]
}
```

### View Templates
- [ ] Templates displayed in grid
- [ ] Template cards show all info (name, description, tags, metadata)
- [ ] Node/edge count correct
- [ ] Created date formatted correctly
- [ ] Hover effects work
- [ ] Empty state shown when no templates

### Copy Template
- [ ] Click template card copies to clipboard
- [ ] "Copy to Clipboard" button works
- [ ] Toast shows "Copied to clipboard!"
- [ ] Can paste JSON in text editor (verify)
- [ ] JSON structure preserved

### Edit Template
- [ ] Click "Edit" button opens edit form
- [ ] Form pre-filled with current data
- [ ] Name can be changed
- [ ] Description can be changed
- [ ] Tags can be added/removed
- [ ] JSON field disabled (cannot edit)
- [ ] "Update Template" saves changes
- [ ] Toast shows "Template updated"
- [ ] Changes reflected in list

### Delete Template
- [ ] Click "Delete" button shows confirmation
- [ ] Confirmation dialog displays template name
- [ ] "Cancel" closes dialog without deleting
- [ ] "Delete" removes template
- [ ] Toast shows "Template deleted"
- [ ] Template removed from list
- [ ] Tag list updated if tags removed

---

## 🔍 Search & Filter Tests

### Search
- [ ] Search bar visible when templates exist
- [ ] Typing filters templates in real-time
- [ ] Searches template names
- [ ] Searches template descriptions
- [ ] Case-insensitive search
- [ ] Clear search shows all templates
- [ ] Empty search result shows message

### Filter by Tags
- [ ] Tag dropdown shows all unique tags
- [ ] Can select multiple tags
- [ ] Templates filtered by selected tags (OR logic)
- [ ] Tag filter chips displayed
- [ ] Click X on chip removes tag filter
- [ ] "Clear" button resets all filters
- [ ] Active filter count badge shown

### Sort
- [ ] Sort dropdown has 5 options
- [ ] **Date (newest first):** Default, newest at top
- [ ] **Date (oldest first):** Oldest at top
- [ ] **Name (A-Z):** Alphabetical ascending
- [ ] **Name (Z-A):** Alphabetical descending
- [ ] **Node Count:** Most nodes first
- [ ] Sort persists during search/filter

### Combined Filters
- [ ] Search + tag filter works together
- [ ] Search + sort works together
- [ ] Tag filter + sort works together
- [ ] All three work together
- [ ] Clear filters resets everything

---

## ⚙️ Settings Tests

### Statistics
- [ ] Total template count accurate
- [ ] Total nodes count accurate
- [ ] Total edges count accurate
- [ ] Counts update after CRUD operations

### Export Templates
- [ ] Click "Export All Templates"
- [ ] File downloads immediately
- [ ] Filename format: `weavy-templates-YYYY-MM-DD.json`
- [ ] File contains valid JSON
- [ ] Export format correct:
  - [ ] `version` field
  - [ ] `exportDate` field
  - [ ] `templateCount` field
  - [ ] `templates` array
- [ ] All templates included
- [ ] Template data complete

### Import Templates
- [ ] Click "Import Templates" opens file picker
- [ ] Select valid export file
- [ ] Templates imported successfully
- [ ] Toast shows import count
- [ ] New templates appear in list
- [ ] Duplicate templates handled
- [ ] Invalid JSON shows error
- [ ] Partial imports (some fail) handled

### Clear All Templates
- [ ] Click "Clear All Templates" shows confirmation
- [ ] Confirmation dialog warns about permanent deletion
- [ ] "Cancel" closes dialog
- [ ] "Clear All" deletes all templates
- [ ] List shows empty state
- [ ] Tag list cleared
- [ ] Statistics reset to zero
- [ ] Toast shows confirmation

### User Info
- [ ] User ID displayed
- [ ] Version number correct (1.0.0)
- [ ] "Back" button returns to list

---

## 🎨 UI/UX Tests

### Visual Design
- [ ] Dark theme consistent throughout
- [ ] Text readable (high contrast)
- [ ] Buttons have hover effects
- [ ] Cards have hover effects
- [ ] Transitions smooth (not jarring)
- [ ] Spacing consistent (8px grid)
- [ ] Icons display correctly
- [ ] Colors match design system

### Responsiveness
- [ ] Popup width fixed at 400px
- [ ] Popup height fixed at 600px
- [ ] Scrolling works when content overflows
- [ ] No horizontal scrolling
- [ ] Grid layout adjusts to content
- [ ] Long text truncates or wraps

### Loading States
- [ ] Initial load shows loading skeleton
- [ ] Buttons disabled during operations
- [ ] Loading indicators shown
- [ ] Operations don't freeze UI

### Empty States
- [ ] No templates: Helpful message + CTA
- [ ] No search results: Clear message
- [ ] No tags: Dropdown shows empty

### Toast Notifications
- [ ] Success toasts (green)
- [ ] Error toasts (red)
- [ ] Info toasts (blue)
- [ ] Auto-dismiss after 3 seconds
- [ ] Manual close button works
- [ ] Multiple toasts stack
- [ ] Slide-in animation smooth

### Modals/Dialogs
- [ ] Backdrop dims background
- [ ] Click backdrop closes dialog
- [ ] Escape key closes dialog
- [ ] Focus trapped in dialog
- [ ] Buttons clearly labeled
- [ ] Danger actions red

---

## 🔧 Technical Tests

### Chrome Extension Compliance
- [ ] Manifest V3 format
- [ ] Service worker active
- [ ] No Manifest V2 patterns
- [ ] Permissions minimal (storage, clipboardWrite)
- [ ] No unused permissions
- [ ] Icons all sizes present (16, 48, 128)

### Service Worker
- [ ] Registers on install
- [ ] Doesn't crash
- [ ] Handles all message types
- [ ] Error handling works
- [ ] No memory leaks
- [ ] Restarts gracefully

### IndexedDB
- [ ] Database initializes
- [ ] Templates persist across sessions
- [ ] CRUD operations work
- [ ] Search queries fast
- [ ] Tag filtering fast
- [ ] No data corruption
- [ ] Can inspect: `chrome://indexeddb-internals`

### Chrome Storage
- [ ] Settings persist
- [ ] User ID generated once
- [ ] Settings survive extension reload

### Message Passing
- [ ] Popup → Service Worker works
- [ ] Responses received correctly
- [ ] Errors propagated to UI
- [ ] No message timeouts
- [ ] Async operations complete

### TypeScript
- [ ] Build completes without errors
- [ ] No TypeScript warnings
- [ ] Strict mode enabled
- [ ] All types correct

---

## 🐛 Error Handling Tests

### Invalid Inputs
- [ ] Empty template name shows error
- [ ] Name < 3 chars shows error
- [ ] Invalid JSON shows error
- [ ] Missing `nodes` array shows error
- [ ] Missing `edges` array shows error
- [ ] Malformed JSON shows error

### Edge Cases
- [ ] Template with empty description
- [ ] Template with no tags
- [ ] Template with max tags (10)
- [ ] Very long template name (100+ chars)
- [ ] Very long description (1000+ chars)
- [ ] Template with 1000+ nodes
- [ ] Search with special characters
- [ ] Import file with 100+ templates

### Error Recovery
- [ ] Failed save shows error toast
- [ ] Failed delete shows error toast
- [ ] Failed copy shows error toast
- [ ] Failed import shows count
- [ ] Service worker restart doesn't lose data
- [ ] Extension reload doesn't lose data

---

## 🚀 Performance Tests

### Speed
- [ ] Popup opens < 1 second
- [ ] Templates load < 1 second
- [ ] Search results instant (< 300ms)
- [ ] Filter results instant
- [ ] Sort results instant
- [ ] Copy to clipboard instant
- [ ] Save template < 500ms

### Scalability
- [ ] 10 templates: All features work
- [ ] 50 templates: All features work
- [ ] 100 templates: All features work
- [ ] 500 templates: Search still fast
- [ ] 1000 templates: Pagination needed?

### Bundle Size
- [ ] service-worker.js < 10KB
- [ ] popup bundle < 300KB
- [ ] Total extension < 1MB

---

## 🔐 Security Tests

### Permissions
- [ ] Only requests needed permissions
- [ ] No host_permissions
- [ ] No activeTab permission
- [ ] No broad permissions

### Data Privacy
- [ ] No external API calls
- [ ] No tracking
- [ ] No analytics
- [ ] All data stored locally
- [ ] No data sent to third parties

### Content Security Policy
- [ ] No inline scripts
- [ ] No eval()
- [ ] No remote code execution
- [ ] Safe JSON parsing

---

## ♿ Accessibility Tests

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter submits forms
- [ ] Escape closes modals
- [ ] Focus visible on all elements
- [ ] No keyboard traps

### Screen Readers
- [ ] Buttons have aria-labels
- [ ] Inputs have labels
- [ ] Errors announced
- [ ] Success messages announced
- [ ] Modal dialogs announced

### Visual
- [ ] High contrast mode supported
- [ ] Text readable at 100% zoom
- [ ] Text readable at 200% zoom
- [ ] Focus indicators visible
- [ ] Color not only indicator

---

## 📱 Cross-Platform Tests

### Chrome Versions
- [ ] Chrome 139 (latest)
- [ ] Chrome 140 (if available)
- [ ] Chromium 139+

### Operating Systems
- [ ] macOS
- [ ] Windows
- [ ] Linux

---

## ✅ Final Checklist

### Pre-Release
- [ ] All tests passed
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Build succeeds
- [ ] Documentation complete
- [ ] Usage guide written
- [ ] README updated

### Release Ready
- [ ] Version number correct (1.0.0)
- [ ] Icons all present
- [ ] Manifest correct
- [ ] Description accurate
- [ ] Screenshots taken (optional)
- [ ] Demo video created (optional)

---

## 📊 Test Results Template

```
Date: ____________________
Tester: __________________
Chrome Version: __________
OS: ______________________

Tests Passed: _____ / _____
Tests Failed: _____
Issues Found: _____

Critical Issues:
-

Minor Issues:
-

Notes:


Approved for Release: [ ] Yes [ ] No
```

---

**Test thoroughly before release! 🧪**
