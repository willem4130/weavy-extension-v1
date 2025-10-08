/**
 * Content Script for Weavy.ai integration
 * Chrome 139+ | Manifest V3
 *
 * Runs in isolated world - cannot access page variables directly
 * Must use postMessage for page communication
 */

import { MessageType, ExtensionMessage, SelectionDataMessage } from './shared/messages';

console.log('Weavy Template Manager content script loaded on:', window.location.href);

/**
 * Listen for messages from service worker and popup
 */
chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
  console.log('Content script received message:', message.type);

  handleMessage(message)
    .then(sendResponse)
    .catch((error) => {
      console.error('Content script error:', error);
      sendResponse({
        type: MessageType.ERROR,
        timestamp: Date.now(),
        payload: {
          error: error.message
        }
      });
    });

  // Return true for async response
  return true;
});

/**
 * Handle incoming messages
 */
async function handleMessage(message: ExtensionMessage): Promise<any> {
  switch (message.type) {
    case MessageType.GET_SELECTION:
      return handleGetSelection();

    case MessageType.PASTE_TEMPLATE:
      return handlePasteTemplate(message);

    default:
      throw new Error(`Unknown message type in content script: ${message.type}`);
  }
}

/**
 * Get current selection from Weavy.ai
 * Placeholder - will be implemented in Phase 2 with actual DOM inspection
 */
async function handleGetSelection(): Promise<SelectionDataMessage> {
  console.log('Getting selection from Weavy.ai...');

  // Check if we're on weavy.ai domain
  if (!window.location.hostname.includes('weavy.ai')) {
    return {
      type: MessageType.SELECTION_DATA,
      timestamp: Date.now(),
      payload: null
    };
  }

  // Placeholder - Phase 2 will implement actual selection detection
  // This will involve:
  // 1. Finding selected nodes/edges in the workflow
  // 2. Extracting their data structure
  // 3. Serializing for storage

  return {
    type: MessageType.SELECTION_DATA,
    timestamp: Date.now(),
    payload: {
      nodes: [],
      edges: []
    }
  };
}

/**
 * Paste template into Weavy.ai workflow
 * Placeholder - will be implemented in Phase 3
 */
async function handlePasteTemplate(message: any): Promise<any> {
  console.log('Pasting template into Weavy.ai:', message.payload.template);

  // Placeholder - Phase 3 will implement:
  // 1. Deserialize template data
  // 2. Inject nodes/edges into workflow
  // 3. Position correctly
  // 4. Connect edges

  return {
    success: true
  };
}

/**
 * Detect when user is on Weavy.ai workflow page
 */
function detectWeavyWorkflow(): boolean {
  // Placeholder - will be implemented in Phase 2
  // Check for specific DOM elements that indicate workflow editor
  return window.location.pathname.includes('/workflow') ||
         window.location.pathname.includes('/editor');
}

/**
 * Initialize content script
 */
function init() {
  console.log('Weavy Template Manager: Initializing on', window.location.href);

  // Check if we're on a workflow page
  if (detectWeavyWorkflow()) {
    console.log('Detected Weavy workflow page');
    // Phase 2: Add UI indicators, keyboard shortcuts, etc.
  }

  // Listen for page navigation (SPA)
  let lastUrl = window.location.href;
  const observer = new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      console.log('Navigation detected:', currentUrl);

      if (detectWeavyWorkflow()) {
        console.log('Navigated to workflow page');
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
