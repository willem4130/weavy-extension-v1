# Weavy Template Manager

**A Chrome extension for saving and managing Weavy.ai workflow templates with a simple clipboard-based workflow.**

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Chrome 139+](https://img.shields.io/badge/Chrome-139%2B-green)](https://www.google.com/chrome/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)

---

## 📋 Overview

Weavy Template Manager allows you to save, organize, and reuse workflow templates from Weavy.ai using a simple copy-paste workflow:

1. **Copy** node/edge JSON from Weavy.ai
2. **Paste** into extension → Add name, tags → Save
3. **Click** template to copy JSON back to clipboard
4. **Paste** into Weavy.ai to restore workflow

**No Weavy.ai integration required!** Pure clipboard-based workflow.

---

## ✨ Features

### Template Management
- 📋 **Create** templates by pasting JSON from Weavy.ai
- ✏️ **Edit** template metadata (name, description, tags)
- 🗑️ **Delete** templates with confirmation
- 📋 **Copy** template JSON to clipboard with one click

### Organization
- 🔍 **Search** templates by name and description
- 🏷️ **Filter** templates by tags (multi-select)
- 📊 **Sort** by date, name, or node count
- 🎨 **Tags** for categorization (up to 10 per template)

### Data Management
- 📥 **Export** all templates to JSON file
- 📤 **Import** templates from JSON file
- 🗄️ **IndexedDB** storage for fast, unlimited local storage
- 🔐 **Private** - all data stored locally in your browser

### User Experience
- 🌙 **Dark theme** with professional design
- ⚡ **Fast** search and filtering
- 📢 **Toast notifications** for all actions
- ♿ **Accessible** with keyboard navigation and ARIA labels

---

## 🚀 Quick Start

### Installation

1. **Clone or download this repository**

2. **Install dependencies:**
   ```bash
   cd weavy-template-manager
   npm install
   ```

3. **Build the extension:**
   ```bash
   npm run build
   ```

4. **Load in Chrome:**
   - Open `chrome://extensions`
   - Enable "Developer mode" (top-right toggle)
   - Click "Load unpacked"
   - Select the `dist/` folder
   - Extension icon appears in toolbar

---

## 📖 Usage

### Create a Template

1. In Weavy.ai, copy your workflow JSON
2. Click the extension icon
3. Click "+ New"
4. Paste JSON into the text area
5. Add a **name** (required)
6. Add **description** and **tags** (optional)
7. Click "Save Template"

**Required JSON format:**
```json
{
  "nodes": [...],
  "edges": [...]
}
```

### Use a Template

1. Click the extension icon
2. Find your template (use search/filter)
3. Click the template card or "Copy to Clipboard" button
4. Toast notification confirms copy
5. In Weavy.ai, paste with `Ctrl+V` (or `Cmd+V`)

### Organize Templates

- **Search:** Type in the search bar (searches names and descriptions)
- **Filter:** Select tags from dropdown
- **Sort:** Choose from 5 sort options (date, name, node count)
- **Tags:** Add multiple tags when creating templates

### Backup Templates

1. Click "⚙️ Settings"
2. Click "📥 Export All Templates"
3. File downloads as `weavy-templates-YYYY-MM-DD.json`
4. Save for backup or sharing

### Restore Templates

1. Click "⚙️ Settings"
2. Click "📤 Import Templates"
3. Select a previously exported JSON file
4. Templates are added to your collection

---

## 🏗️ Architecture

### Tech Stack

- **Chrome 139+** - Manifest V3
- **React 19** - UI framework
- **TypeScript 5.9** - Strict mode
- **Vite 7** - Build tool
- **IndexedDB** - Local storage
- **CSS Custom Properties** - Dark theme

### Project Structure

```
weavy-template-manager/
├── src/
│   ├── service-worker.ts        # Background service worker
│   ├── popup/
│   │   ├── App.tsx              # Main popup application
│   │   ├── components/          # React components
│   │   │   ├── TemplateCard.tsx
│   │   │   ├── TemplateList.tsx
│   │   │   ├── TemplateForm.tsx
│   │   │   ├── SearchFilter.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── ConfirmDialog.tsx
│   │   ├── styles/
│   │   │   ├── theme.css        # Design system
│   │   │   └── popup.css        # Component styles
│   │   ├── main.tsx             # Entry point
│   │   └── popup.html
│   └── shared/
│       ├── db.ts                # IndexedDB wrapper
│       ├── types.ts             # TypeScript interfaces
│       ├── messages.ts          # Message passing types
│       └── utils.ts             # Shared utilities
├── public/
│   ├── manifest.json            # Extension manifest
│   └── icons/                   # Extension icons
├── dist/                        # Build output (git-ignored)
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── USAGE_GUIDE.md               # Detailed usage guide
├── TESTING_CHECKLIST.md         # Testing checklist
└── README.md                    # This file
```

---

## 🗄️ Data Storage

### IndexedDB (Templates)

- **Database:** `WeavyTemplates`
- **Store:** `templates`
- **Indexes:** userId, createdAt, name, tags
- **Features:** Fast queries, unlimited storage, structured clone

### chrome.storage.local (Settings)

- **User ID:** Generated UUID for future features
- **Version:** Extension version
- **Theme:** Dark theme preference

### Template Schema

```typescript
interface Template {
  id: string;              // UUID v4
  userId: string;          // For future multi-user support
  name: string;            // User-defined name
  description?: string;    // Optional description
  tags: string[];          // Categorization tags
  data: {
    nodes: Node[];         // Weavy workflow nodes
    edges: Edge[];         // Weavy workflow edges
  };
  createdAt: number;       // Unix timestamp
  updatedAt: number;       // Unix timestamp
  version: number;         // Schema version (1)
}
```

---

## 🔧 Development

### Install Dependencies

```bash
npm install
```

### Development Build (Watch Mode)

```bash
npm run dev
```

Vite will rebuild on file changes. Reload the extension in Chrome to see updates.

### Production Build

```bash
npm run build
```

Output in `dist/` folder, ready to load in Chrome.

### Type Check

```bash
npm run type-check
```

### Lint

```bash
npm run lint
```

---

## 🧪 Testing

See [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) for comprehensive testing guide.

**Quick test:**

1. Build: `npm run build`
2. Load in `chrome://extensions`
3. Create test template with sample JSON
4. Verify copy to clipboard works
5. Test search, filter, sort
6. Test export/import
7. Check Chrome DevTools for errors

---

## 🎨 Design System

### Dark Theme

Professional dark theme optimized for 400x600px popup:

- **Backgrounds:** #1a1a1a, #242424, #2d2d2d
- **Accent:** #6366f1 (Indigo)
- **Text:** #f5f5f5, #a3a3a3, #737373
- **Semantic:** Success, danger, warning, info colors

### Components

- Buttons (primary, secondary, danger, icon)
- Cards (basic, hoverable, elevated)
- Inputs (text, textarea, with validation)
- Tags/Chips (colored, removable)
- Modals (backdrop, fade-in animation)
- Toasts (auto-dismiss, manual close)
- Loading states (skeleton, spinner)

---

## 📊 Features Roadmap

### ✅ Completed (v1.0.0)

- [x] IndexedDB storage layer
- [x] Template CRUD operations
- [x] Dark theme UI
- [x] Search functionality
- [x] Tag filtering
- [x] Sort options
- [x] Copy to clipboard
- [x] Export/import templates
- [x] Toast notifications
- [x] Confirmation dialogs
- [x] Settings page
- [x] Error handling
- [x] Loading states
- [x] Empty states

### 🔮 Future Features

- [ ] Template folders/categories
- [ ] Duplicate template
- [ ] Template versioning
- [ ] Keyboard shortcuts (Ctrl+F for search, etc.)
- [ ] Template preview visualization
- [ ] Batch operations (delete multiple, export selected)
- [ ] Cloud sync (optional)
- [ ] Template marketplace
- [ ] Collaboration features

---

## 🐛 Debugging

### Service Worker

1. Go to `chrome://extensions`
2. Find "Weavy Template Manager"
3. Click "service worker" link
4. Check Console tab for errors

### Popup

1. Right-click extension icon
2. Select "Inspect popup"
3. DevTools opens for popup
4. Check Console, Network, Storage tabs

### IndexedDB

1. Open DevTools for popup
2. Go to Application → Storage → IndexedDB
3. Expand WeavyTemplates database
4. Inspect templates store

---

## 🔐 Privacy & Security

- ✅ **Local-only storage** - No cloud sync or external servers
- ✅ **No tracking** - No analytics or telemetry
- ✅ **No external requests** - All code runs locally
- ✅ **Minimal permissions** - Only `storage` and `clipboardWrite`
- ✅ **No host permissions** - Doesn't access any websites
- ✅ **Open source** - Review the code yourself

---

## 📋 Requirements

- **Chrome:** Version 139 or higher
- **Manifest:** V3 (required for Chrome extensions)
- **Permissions:**
  - `storage` - For extension settings
  - `clipboardWrite` - For copying templates

---

## 🤝 Contributing

This is currently a private project. If you have suggestions or find bugs:

1. Check [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) first
2. Review Console errors in Chrome DevTools
3. Create detailed bug reports with steps to reproduce

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) file for details

---

## 📚 Documentation

- **[USAGE_GUIDE.md](./USAGE_GUIDE.md)** - Comprehensive usage guide
- **[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)** - Complete testing checklist
- **[PHASE1_COMPLETE.md](./PHASE1_COMPLETE.md)** - Phase 1 completion report
- **[DESIGN_SYSTEM.md](./src/popup/styles/DESIGN_SYSTEM.md)** - Design system documentation

---

## 🙏 Acknowledgments

- **Weavy.ai** - AI-powered design workflow platform
- **Chrome Extensions Team** - Manifest V3 documentation
- **React Team** - React 19 framework
- **Vite Team** - Fast build tool

---

## 📞 Support

For issues or questions:

1. Review [USAGE_GUIDE.md](./USAGE_GUIDE.md)
2. Check [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)
3. Inspect Chrome DevTools for errors
4. Create a detailed bug report

---

**Made with ❤️ for Weavy.ai workflows**

**Version:** 1.0.0
**Updated:** 2025-10-08
**Status:** ✅ Production Ready
