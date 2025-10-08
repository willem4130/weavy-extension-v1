# Chrome API Reference - Weavy Template Manager

Quick reference for Chrome extension APIs used in this project (Chrome 139+).

## Storage API

### chrome.storage.local

**Purpose**: Persistent key-value storage (recommended over IndexedDB for extensions)

**Quota**: 10MB total (chrome.storage.local.QUOTA_BYTES)

```typescript
// Write data
await chrome.storage.local.set({
  templates: [...],
  settings: {...}
});

// Read data
const result = await chrome.storage.local.get(['templates']);
console.log(result.templates);

// Read all keys
const allData = await chrome.storage.local.get(null);

// Get specific keys (Chrome 130+)
const keys = await chrome.storage.local.getKeys();

// Remove data
await chrome.storage.local.remove(['templates']);

// Clear all data
await chrome.storage.local.clear();
```

**Best Practices**:
- Use structured keys (e.g., 'templates', 'settings')
- Batch operations when possible
- Handle storage errors gracefully
- Don't store sensitive data unencrypted

## Runtime API

### chrome.runtime.sendMessage

**Purpose**: Send messages between extension components

```typescript
// Send from content script to service worker
const response = await chrome.runtime.sendMessage({
  type: 'SAVE_TEMPLATE',
  payload: { name: 'My Template', data: {...} }
});

// Send with callback
chrome.runtime.sendMessage(
  { type: 'GET_TEMPLATES' },
  (response) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }
    console.log(response);
  }
);
```

### chrome.runtime.onMessage

**Purpose**: Listen for messages from other extension components

```typescript
// MUST be in global scope for service workers
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle message asynchronously
  handleMessage(message)
    .then(sendResponse)
    .catch(error => sendResponse({ error: error.message }));

  // Return true for async response
  return true;
});
```

### chrome.runtime.onInstalled

**Purpose**: Detect extension installation/update

```typescript
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('First install');
    // Initialize storage
  } else if (details.reason === 'update') {
    console.log('Updated from', details.previousVersion);
    // Migration logic
  }
});
```

### chrome.runtime.lastError

**Purpose**: Check for errors in async operations

```typescript
chrome.tabs.sendMessage(tabId, message, (response) => {
  if (chrome.runtime.lastError) {
    console.error('Error:', chrome.runtime.lastError.message);
    return;
  }
  // Process response
});
```

## Tabs API

### chrome.tabs.query

**Purpose**: Find tabs matching criteria

```typescript
// Get active tab in current window
const [tab] = await chrome.tabs.query({
  active: true,
  currentWindow: true
});

// Get all tabs
const allTabs = await chrome.tabs.query({});

// Get tabs by URL pattern
const weavyTabs = await chrome.tabs.query({
  url: '*://*.weavy.ai/*'
});
```

### chrome.tabs.sendMessage

**Purpose**: Send message to content script in specific tab

```typescript
// Send to specific tab
const response = await chrome.tabs.sendMessage(tabId, {
  type: 'PASTE_TEMPLATE',
  payload: { template: {...} }
});

// With callback
chrome.tabs.sendMessage(tabId, message, (response) => {
  if (chrome.runtime.lastError) {
    console.error('Tab not responding');
    return;
  }
  console.log(response);
});
```

### chrome.tabs.onUpdated

**Purpose**: Detect tab URL/status changes

```typescript
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('weavy.ai')) {
    console.log('Weavy.ai page loaded');
  }
});
```

## Alarms API

### chrome.alarms.create

**Purpose**: Schedule tasks (service worker keepalive, periodic operations)

```typescript
// One-time alarm (1 minute from now)
chrome.alarms.create('myAlarm', { delayInMinutes: 1 });

// Recurring alarm (every 15 seconds - minimum)
chrome.alarms.create('keepAlive', { periodInMinutes: 0.25 });

// Daily alarm at specific time
chrome.alarms.create('dailySync', {
  when: Date.now() + 1000,
  periodInMinutes: 1440 // 24 hours
});
```

### chrome.alarms.onAlarm

**Purpose**: Handle alarm triggers

```typescript
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keepAlive') {
    // Trivial operation to reset 30s timeout
    chrome.storage.local.get(['settings']);
  } else if (alarm.name === 'sync') {
    // Perform sync operation
  }
});
```

### chrome.alarms.clear

**Purpose**: Cancel scheduled alarms

```typescript
// Clear specific alarm
await chrome.alarms.clear('myAlarm');

// Clear all alarms
await chrome.alarms.clearAll();
```

## Action API (Manifest V3)

### chrome.action.setBadgeText

**Purpose**: Show badge on extension icon

```typescript
// Show notification count
await chrome.action.setBadgeText({ text: '5' });

// Clear badge
await chrome.action.setBadgeText({ text: '' });

// Tab-specific badge
await chrome.action.setBadgeText({
  text: '!',
  tabId: tab.id
});
```

### chrome.action.setBadgeBackgroundColor

**Purpose**: Set badge color

```typescript
await chrome.action.setBadgeBackgroundColor({
  color: '#FF0000'
});

// RGB array
await chrome.action.setBadgeBackgroundColor({
  color: [255, 0, 0, 255]
});
```

### chrome.action.setTitle

**Purpose**: Set tooltip text

```typescript
await chrome.action.setTitle({
  title: '5 templates saved'
});
```

## Clipboard API

### navigator.clipboard.writeText

**Purpose**: Write text to clipboard (requires clipboardWrite permission)

```typescript
// Write to clipboard
await navigator.clipboard.writeText('Hello World');

// Read from clipboard (requires user gesture)
const text = await navigator.clipboard.readText();
```

**Note**: clipboardRead requires user gesture, clipboardWrite does not.

## Service Worker Lifecycle

### Important Behaviors

**30-Second Idle Timeout**:
- Service worker terminates after 30s of inactivity
- ALL state MUST be persisted
- Event listeners MUST be in global scope

**Keepalive Strategy**:
```typescript
// Use alarms API (minimum 15 seconds)
chrome.alarms.create('keepAlive', { periodInMinutes: 0.25 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keepAlive') {
    // Trivial operation to reset timeout
    chrome.runtime.getPlatformInfo();
  }
});
```

**State Persistence**:
```typescript
// BAD - Lost on termination
let cachedData = [];

// GOOD - Persisted
await chrome.storage.local.set({ cachedData: [] });
const { cachedData } = await chrome.storage.local.get(['cachedData']);
```

## Content Script Communication

### From Content Script to Page

**Using postMessage** (content script runs in isolated world):

```typescript
// Content script
window.postMessage({ type: 'FROM_EXTENSION', data: {...} }, '*');

// Page script
window.addEventListener('message', (event) => {
  if (event.data.type === 'FROM_EXTENSION') {
    console.log('Extension sent:', event.data.data);
  }
});
```

### From Page to Content Script

```typescript
// Page script
window.postMessage({ type: 'TO_EXTENSION', data: {...} }, '*');

// Content script
window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  if (event.data.type === 'TO_EXTENSION') {
    // Forward to service worker
    chrome.runtime.sendMessage(event.data);
  }
});
```

## Error Handling

### Common Patterns

```typescript
// Check for runtime errors
try {
  const response = await chrome.runtime.sendMessage(message);
  if (chrome.runtime.lastError) {
    throw new Error(chrome.runtime.lastError.message);
  }
  return response;
} catch (error) {
  console.error('Message failed:', error);
  // Handle error
}

// Timeout for long operations
function sendMessageWithTimeout(message, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Timeout'));
    }, timeout);

    chrome.runtime.sendMessage(message, (response) => {
      clearTimeout(timer);
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response);
      }
    });
  });
}
```

## Permissions

### Required in manifest.json

```json
{
  "permissions": [
    "storage",        // chrome.storage.*
    "clipboardWrite", // navigator.clipboard.writeText
    "activeTab",      // Access current tab only
    "alarms"          // chrome.alarms.*
  ],
  "host_permissions": [
    "*://*.weavy.ai/*"  // Content script injection
  ]
}
```

### Optional Permissions

```json
{
  "optional_permissions": ["tabs", "clipboardRead"],
  "optional_host_permissions": ["*://*/*"]
}
```

Request at runtime:
```typescript
const granted = await chrome.permissions.request({
  permissions: ['tabs'],
  origins: ['https://example.com/*']
});

if (granted) {
  // Permission granted
}
```

## Debugging

### Service Worker Console

1. Open `chrome://extensions`
2. Find extension
3. Click "service worker" link
4. DevTools opens for service worker

### Content Script Console

1. Open page where content script runs
2. Press F12 to open DevTools
3. Check Console tab
4. Look for content script logs

### Popup Console

1. Right-click extension icon
2. Select "Inspect popup"
3. DevTools opens for popup

### Storage Inspector (Chrome 132+)

1. Open DevTools
2. Go to Application tab
3. Expand "Storage" section
4. Click "Extension Storage"
5. View chrome.storage.local data

## Chrome 139+ Features Used

- ES modules for service worker
- chrome.storage.local (preferred over IndexedDB)
- chrome.action (replaces browserAction/pageAction)
- Manifest V3 structure
- Service worker instead of background page
- Host permissions separate from permissions

## Deprecated APIs (DO NOT USE)

- `chrome.browserAction` → Use `chrome.action`
- `chrome.pageAction` → Use `chrome.action`
- `background.page` → Use `background.service_worker`
- `background.persistent` → Not allowed in V3
- `chrome.webRequest` blocking → Use `declarativeNetRequest`
- `XMLHttpRequest` → Use `fetch()`
- `localStorage` → Use `chrome.storage.local`

## Performance Tips

1. **Batch Storage Operations**
```typescript
// BAD
await chrome.storage.local.set({ key1: value1 });
await chrome.storage.local.set({ key2: value2 });

// GOOD
await chrome.storage.local.set({
  key1: value1,
  key2: value2
});
```

2. **Parallel Queries**
```typescript
// BAD
const tabs = await chrome.tabs.query({});
const storage = await chrome.storage.local.get();

// GOOD
const [tabs, storage] = await Promise.all([
  chrome.tabs.query({}),
  chrome.storage.local.get()
]);
```

3. **Minimize Service Worker Work**
- Offload heavy computation to content scripts or offscreen documents
- Keep service worker code < 2KB
- Use dynamic imports for large libraries

## Additional Resources

- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/migrating/)
- [Service Worker Best Practices](https://developer.chrome.com/docs/extensions/mv3/service_workers/basics/)
