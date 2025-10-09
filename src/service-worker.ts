/**
 * Service Worker for Weavy Template Manager
 * Chrome 139+ | Manifest V3
 *
 * CRITICAL: Event listeners MUST be in global scope
 * Service worker terminates after 30s idle
 * Template data persists in IndexedDB
 * Settings persist in chrome.storage.local
 */

import { templateDB } from './shared/db';
import {
  MessageType,
  ExtensionMessage,
  SaveTemplateMessage,
  GetTemplatesMessage,
  DeleteTemplateMessage,
  UpdateTemplateMessage,
  CopyTemplateMessage,
  SearchTemplatesMessage,
  FilterByTagsMessage,
  ImportTemplatesMessage,
  ClearAllTemplatesMessage
} from './shared/messages';
import type { Template } from './shared/types';

// Event listeners in GLOBAL scope - REQUIRED for Manifest V3
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    try {
      // Initialize IndexedDB
      await templateDB.init();

      // Initialize settings in chrome.storage.local
      await chrome.storage.local.set({
        settings: {
          userId: crypto.randomUUID(),
          version: '2.0.0',
          theme: 'dark'
        }
      });

      // Open side panel on first install
      await chrome.sidePanel.setOptions({
        enabled: true
      });
    } catch (error) {
      console.error('Failed to initialize extension:', error);
    }
  }
});

// Handle action clicks to open side panel - MUST be in global scope
chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Open the side panel for the current tab
    if (tab.id) {
      await chrome.sidePanel.open({ tabId: tab.id });
    }
  } catch (error) {
    console.error('Failed to open side panel:', error);
  }
});

// Message handler - MUST be in global scope
chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender, sendResponse) => {
  // Handle messages asynchronously
  handleMessage(message, sender)
    .then(sendResponse)
    .catch((error) => {
      sendResponse({
        type: MessageType.ERROR,
        timestamp: Date.now(),
        payload: {
          error: error.message || 'Unknown error',
          details: error
        }
      });
    });

  // Return true to indicate async response
  return true;
});

/**
 * Handle incoming messages
 */
async function handleMessage(
  message: ExtensionMessage,
  _sender: chrome.runtime.MessageSender
): Promise<any> {
  // Ensure database is initialized
  await templateDB.init();

  switch (message.type) {
    case MessageType.SAVE_TEMPLATE:
      return handleSaveTemplate(message as SaveTemplateMessage);

    case MessageType.GET_TEMPLATES:
      return handleGetTemplates(message as GetTemplatesMessage);

    case MessageType.DELETE_TEMPLATE:
      return handleDeleteTemplate(message as DeleteTemplateMessage);

    case MessageType.UPDATE_TEMPLATE:
      return handleUpdateTemplate(message as UpdateTemplateMessage);

    case MessageType.COPY_TEMPLATE:
      return handleCopyTemplate(message as CopyTemplateMessage);

    case MessageType.SEARCH_TEMPLATES:
      return handleSearchTemplates(message as SearchTemplatesMessage);

    case MessageType.FILTER_BY_TAGS:
      return handleFilterByTags(message as FilterByTagsMessage);

    case MessageType.GET_ALL_TAGS:
      return handleGetAllTags();

    case MessageType.EXPORT_TEMPLATES:
      return handleExportTemplates();

    case MessageType.IMPORT_TEMPLATES:
      return handleImportTemplates(message as ImportTemplatesMessage);

    case MessageType.CLEAR_ALL_TEMPLATES:
      return handleClearAllTemplates(message as ClearAllTemplatesMessage);

    default:
      throw new Error(`Unknown message type: ${(message as any).type}`);
  }
}

/**
 * Save template to IndexedDB
 */
async function handleSaveTemplate(message: SaveTemplateMessage) {
  try {
    // Get userId from settings
    const settings = await chrome.storage.local.get(['settings']);
    const userId = settings.settings?.userId || 'anonymous';

    // Create template in IndexedDB
    const template = await templateDB.create({
      userId,
      name: message.payload.name,
      description: message.payload.description,
      tags: message.payload.tags,
      data: {
        nodes: message.payload.nodes,
        edges: message.payload.edges
      }
    });

    return {
      type: MessageType.TEMPLATE_SAVED,
      timestamp: Date.now(),
      payload: { template }
    };
  } catch (error) {
    throw new Error(`Failed to save template: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get templates from IndexedDB
 * Supports optional filtering by tags or search query
 */
async function handleGetTemplates(message: GetTemplatesMessage) {
  try {
    let templates: Template[];

    if (message.payload?.searchQuery) {
      // Search by query
      templates = await templateDB.search(message.payload.searchQuery);
    } else if (message.payload?.tags && message.payload.tags.length > 0) {
      // Filter by tags
      templates = await templateDB.filterByTags(message.payload.tags);
    } else {
      // Get all templates
      templates = await templateDB.getAll();
    }

    return {
      type: MessageType.TEMPLATES_LIST,
      timestamp: Date.now(),
      payload: { templates }
    };
  } catch (error) {
    throw new Error(`Failed to get templates: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete template from IndexedDB
 */
async function handleDeleteTemplate(message: DeleteTemplateMessage) {
  try {
    await templateDB.delete(message.payload.templateId);

    return {
      type: MessageType.TEMPLATE_SAVED,
      timestamp: Date.now(),
      payload: { success: true }
    };
  } catch (error) {
    throw new Error(`Failed to delete template: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Update template in IndexedDB
 */
async function handleUpdateTemplate(message: UpdateTemplateMessage) {
  try {
    const updated = await templateDB.update(
      message.payload.templateId,
      message.payload.updates
    );

    return {
      type: MessageType.TEMPLATE_SAVED,
      timestamp: Date.now(),
      payload: { template: updated }
    };
  } catch (error) {
    throw new Error(`Failed to update template: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get template JSON data for clipboard copy
 * Returns data to popup/sidepanel which handles clipboard write
 * (Service workers cannot access navigator.clipboard)
 */
async function handleCopyTemplate(message: CopyTemplateMessage) {
  try {
    const template = await templateDB.getById(message.payload.templateId);

    if (!template) {
      throw new Error('Template not found');
    }

    // Return template data (nodes + edges) as JSON string
    // Popup/sidepanel will write to clipboard
    const jsonString = JSON.stringify(template.data, null, 2);

    return {
      type: MessageType.TEMPLATE_COPIED,
      timestamp: Date.now(),
      payload: {
        success: true,
        data: jsonString
      }
    };
  } catch (error) {
    throw new Error(`Failed to copy template: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Search templates by query string
 */
async function handleSearchTemplates(message: SearchTemplatesMessage) {
  try {
    const templates = await templateDB.search(message.payload.query);

    return {
      type: MessageType.TEMPLATES_LIST,
      timestamp: Date.now(),
      payload: { templates }
    };
  } catch (error) {
    throw new Error(`Failed to search templates: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Filter templates by tags
 */
async function handleFilterByTags(message: FilterByTagsMessage) {
  try {
    const templates = await templateDB.filterByTags(message.payload.tags);

    return {
      type: MessageType.TEMPLATES_LIST,
      timestamp: Date.now(),
      payload: { templates }
    };
  } catch (error) {
    throw new Error(`Failed to filter templates: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get all unique tags
 */
async function handleGetAllTags() {
  try {
    const tags = await templateDB.getAllTags();

    return {
      type: MessageType.TAGS_LIST,
      timestamp: Date.now(),
      payload: { tags }
    };
  } catch (error) {
    throw new Error(`Failed to get tags: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Export all templates as JSON
 */
async function handleExportTemplates() {
  try {
    const templates = await templateDB.getAll();

    return {
      type: MessageType.EXPORT_DATA,
      timestamp: Date.now(),
      payload: {
        version: '1.0.0',
        exportDate: Date.now(),
        templateCount: templates.length,
        templates
      }
    };
  } catch (error) {
    throw new Error(`Failed to export templates: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Import templates from JSON
 */
async function handleImportTemplates(message: ImportTemplatesMessage) {
  try {
    const data = JSON.parse(message.payload.data);

    if (!data.templates || !Array.isArray(data.templates)) {
      throw new Error('Invalid import data format');
    }

    // Get userId from settings
    const settings = await chrome.storage.local.get(['settings']);
    const userId = settings.settings?.userId || 'anonymous';

    let imported = 0;
    let failed = 0;

    // Import each template
    for (const template of data.templates) {
      try {
        await templateDB.create({
          userId,
          name: template.name,
          description: template.description,
          tags: template.tags || [],
          data: template.data
        });
        imported++;
      } catch (error) {
        failed++;
      }
    }

    return {
      type: MessageType.IMPORT_COMPLETE,
      timestamp: Date.now(),
      payload: { imported, failed }
    };
  } catch (error) {
    throw new Error(`Failed to import templates: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Clear all templates from IndexedDB
 */
async function handleClearAllTemplates(_message: ClearAllTemplatesMessage) {
  try {
    await templateDB.clear();

    return {
      type: MessageType.TEMPLATES_LIST,
      timestamp: Date.now(),
      payload: { templates: [] }
    };
  } catch (error) {
    throw new Error(`Failed to clear templates: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
