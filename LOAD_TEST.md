# Load Test Instructions

## Quick Start

1. **Build the extension**:
```bash
cd weavy-template-manager
npm run build
```

2. **Open Chrome Extensions**:
   - Open Chrome
   - Navigate to `chrome://extensions`
   - Enable "Developer mode" (toggle in top-right corner)

3. **Load unpacked extension**:
   - Click "Load unpacked" button
   - Navigate to the `dist/` folder
   - Click "Select"

4. **Verify installation**:
   - Extension should appear in your extensions list
   - Icon should appear in Chrome toolbar
   - No errors should be shown

## Verification Checklist

### Service Worker
- [ ] Service worker shows "active" status in chrome://extensions
- [ ] Click "service worker" link to open DevTools
- [ ] Console shows: "Weavy Template Manager service worker loaded"
- [ ] No errors in console

### Popup
- [ ] Click extension icon in toolbar
- [ ] Popup opens (400px wide)
- [ ] Shows "Weavy Template Manager" header
- [ ] Shows empty state: "No templates yet"
- [ ] No errors in popup console (right-click popup → Inspect)

### Content Script
- [ ] Open any website (e.g., google.com)
- [ ] Content script should NOT inject (not on weavy.ai)
- [ ] Open weavy.ai website (if available)
- [ ] Content script should inject
- [ ] Check console for: "Weavy Template Manager content script loaded"

### Permissions
- [ ] Extension requests only necessary permissions
- [ ] No permission warnings
- [ ] Storage permission granted
- [ ] ClipboardWrite permission granted
- [ ] ActiveTab permission granted
- [ ] Alarms permission granted

### Manifest Validation
- [ ] manifest.json loads without errors
- [ ] All icon files present (16, 48, 128)
- [ ] Service worker file found
- [ ] Content script file found
- [ ] Popup HTML file found

## Common Issues

### "Manifest file is missing or unreadable"
- Ensure you selected the `dist/` folder, not the project root
- Run `npm run build` to generate dist folder
- Check that `dist/manifest.json` exists

### "Service worker registration failed"
- Check that `dist/service-worker.js` exists
- Look for syntax errors in service worker console
- Ensure "type": "module" is in manifest

### "Popup doesn't open"
- Check that `dist/popup.html` exists
- Verify asset paths in popup.html are correct
- Open popup DevTools (right-click icon → Inspect popup)

### "Icons not showing"
- Verify `dist/icons/` folder exists
- Check that icon files are present (icon16.png, icon48.png, icon128.png)
- Reload extension after fixing

## Debugging

### Service Worker Console
```
1. chrome://extensions
2. Find "Weavy Template Manager"
3. Click "service worker" link
4. DevTools opens
```

### Popup Console
```
1. Click extension icon
2. Right-click popup
3. Select "Inspect"
4. DevTools opens
```

### Content Script Console
```
1. Open page with content script (weavy.ai)
2. Press F12
3. Check Console tab
4. Look for "Weavy Template Manager" prefix
```

## Expected Console Output

### Service Worker
```
Weavy Template Manager service worker loaded
Weavy Template Manager installed: install
```

### Content Script (on weavy.ai)
```
Weavy Template Manager content script loaded on: https://app.weavy.ai/...
Weavy Template Manager: Initializing on https://app.weavy.ai/...
```

### Popup
```
(No errors - clean console)
```

## Test Scenarios

### 1. Basic Load Test
- [x] Extension loads without errors
- [x] Service worker registers
- [x] Popup opens
- [x] Icons display correctly

### 2. Permission Test
- [x] Only requested permissions shown
- [x] No unexpected permission requests
- [x] Storage access works
- [x] Clipboard access works (when implemented)

### 3. Messaging Test
- [ ] Service worker receives messages (Phase 2)
- [ ] Content script receives messages (Phase 2)
- [ ] Popup can communicate with service worker
- [ ] Timeout handling works

### 4. Storage Test
- [ ] Can write to chrome.storage.local (Phase 2)
- [ ] Can read from chrome.storage.local
- [ ] Storage persists after service worker restart
- [ ] Storage survives browser restart

### 5. Lifecycle Test
- [ ] Service worker starts on extension load
- [ ] Service worker restarts after 30s idle
- [ ] Event listeners still work after restart
- [ ] Alarms keepalive works

## Success Criteria

Extension is ready if:
- ✅ Loads without errors
- ✅ Service worker active
- ✅ Popup opens and displays
- ✅ Content script injects on weavy.ai
- ✅ No console errors
- ✅ Icons display correctly
- ✅ Permissions are minimal

## Next Steps After Successful Load

1. Test on weavy.ai website
2. Verify content script injection
3. Test popup functionality
4. Begin Phase 2 development
5. Implement storage operations
6. Add actual Weavy.ai integration

## Troubleshooting

If load test fails, check:
1. `npm run build` completed successfully
2. `dist/` folder exists and has files
3. `dist/manifest.json` is valid JSON
4. All referenced files exist in dist/
5. Chrome is updated to latest version (139+)

## Report Issues

If you encounter errors not listed here:
1. Copy error message from console
2. Check browser version (chrome://version)
3. Verify all files present in dist/
4. Check manifest.json syntax
5. Review service worker console for errors

---

**Phase 1 Complete** ✅
Ready for chrome://extensions load test
