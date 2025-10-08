/**
 * Usage examples for TemplateDatabase
 * Chrome 139+ Compatible | Manifest V3
 */

import { templateDB } from './db';
import type { Template } from './types';

/**
 * Example 1: Initialize database
 * Call this once when your extension loads (service worker or popup)
 */
async function initializeDatabase() {
  try {
    await templateDB.init();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

/**
 * Example 2: Create a new template
 */
async function createTemplate() {
  await templateDB.init();

  const template = await templateDB.create({
    userId: 'user123',
    name: 'My First Template',
    description: 'A template for React components',
    tags: ['react', 'typescript', 'component'],
    data: {
      nodes: [
        {
          id: 'node-1',
          isModel: false,
          type: 'custom',
          position: { x: 100, y: 100 },
          data: { label: 'Start Node' }
        }
      ],
      edges: []
    }
  });

  console.log('Created template:', template.id);
  return template;
}

/**
 * Example 3: Get all templates
 */
async function listAllTemplates() {
  await templateDB.init();

  const templates = await templateDB.getAll();
  console.log(`Found ${templates.length} templates`);

  templates.forEach(template => {
    console.log(`- ${template.name} (${template.tags.join(', ')})`);
  });

  return templates;
}

/**
 * Example 4: Search templates
 */
async function searchTemplates(query: string) {
  await templateDB.init();

  const results = await templateDB.search(query);
  console.log(`Found ${results.length} templates matching "${query}"`);

  return results;
}

/**
 * Example 5: Filter by tags
 */
async function filterByTags(tags: string[]) {
  await templateDB.init();

  const results = await templateDB.filterByTags(tags);
  console.log(`Found ${results.length} templates with tags: ${tags.join(' OR ')}`);

  return results;
}

/**
 * Example 6: Update a template
 */
async function updateTemplate(id: string) {
  await templateDB.init();

  const updated = await templateDB.update(id, {
    name: 'Updated Template Name',
    tags: ['updated', 'modified'],
    description: 'This template has been updated'
  });

  console.log('Updated template:', updated.name);
  return updated;
}

/**
 * Example 7: Delete a template
 */
async function deleteTemplate(id: string) {
  await templateDB.init();

  await templateDB.delete(id);
  console.log(`Deleted template: ${id}`);
}

/**
 * Example 8: Get all unique tags
 */
async function getAllTags() {
  await templateDB.init();

  const tags = await templateDB.getAllTags();
  console.log('Available tags:', tags);

  return tags;
}

/**
 * Example 9: Use in service worker
 * Service workers should initialize database on install
 */
async function serviceWorkerExample() {
  // Initialize database when service worker starts
  await templateDB.init();

  // Listen for messages from popup/content scripts
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'GET_TEMPLATES') {
      templateDB.getAll().then(templates => {
        sendResponse({ templates });
      });
      return true; // Keep channel open for async response
    }

    if (message.type === 'CREATE_TEMPLATE') {
      templateDB.create(message.template).then(template => {
        sendResponse({ template });
      });
      return true;
    }
  });
}

/**
 * Example 10: Use in popup
 * Popup can directly access database
 */
async function popupExample() {
  // Initialize when popup opens
  await templateDB.init();

  // Load templates
  const templates = await templateDB.getAll();

  // Display in UI
  displayTemplates(templates);

  // Search functionality
  const searchInput = document.getElementById('search') as HTMLInputElement;
  searchInput?.addEventListener('input', async (e) => {
    const query = (e.target as HTMLInputElement).value;
    const results = await templateDB.search(query);
    displayTemplates(results);
  });
}

/**
 * Example 11: Error handling
 */
async function errorHandlingExample() {
  try {
    await templateDB.init();

    // Try to update non-existent template
    try {
      await templateDB.update('non-existent-id', { name: 'New Name' });
    } catch (error) {
      console.error('Template not found:', error);
    }

    // Create template with validation
    const template = await templateDB.create({
      userId: 'user123',
      name: 'Valid Template',
      tags: [],
      data: { nodes: [], edges: [] }
    });

    console.log('Created successfully:', template.id);
  } catch (error) {
    console.error('Database error:', error);
  }
}

/**
 * Example 12: Complex query - Find templates by multiple criteria
 */
async function complexQuery() {
  await templateDB.init();

  // Get templates with specific tags
  const reactTemplates = await templateDB.filterByTags(['react', 'typescript']);

  // Further filter by search term
  const searchTerm = 'component';
  const filtered = reactTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm) ||
    template.description?.toLowerCase().includes(searchTerm)
  );

  // Sort by most recently updated
  filtered.sort((a, b) => b.updatedAt - a.updatedAt);

  return filtered;
}

/**
 * Example 13: Export/Import templates
 */
async function exportTemplates() {
  await templateDB.init();

  const templates = await templateDB.getAll();
  const exportData = {
    version: 1,
    exportedAt: Date.now(),
    templates
  };

  // Create blob for download
  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json'
  });

  return blob;
}

async function importTemplates(importData: { templates: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>[] }) {
  await templateDB.init();

  const imported: Template[] = [];

  for (const template of importData.templates) {
    const created = await templateDB.create(template);
    imported.push(created);
  }

  console.log(`Imported ${imported.length} templates`);
  return imported;
}

/**
 * Example 14: Clear all templates (with confirmation)
 */
async function clearAllTemplates() {
  await templateDB.init();

  const confirm = window.confirm(
    'Are you sure you want to delete all templates? This cannot be undone.'
  );

  if (confirm) {
    await templateDB.clear();
    console.log('All templates deleted');
  }
}

// Helper function for displaying templates
function displayTemplates(templates: Template[]) {
  const container = document.getElementById('templates-container');
  if (!container) return;

  container.innerHTML = templates
    .map(
      template => `
        <div class="template-card">
          <h3>${template.name}</h3>
          <p>${template.description || 'No description'}</p>
          <div class="tags">
            ${template.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
          <div class="meta">
            ${template.data.nodes.length} nodes, ${template.data.edges.length} edges
          </div>
        </div>
      `
    )
    .join('');
}

// Export examples for use in other files
export {
  initializeDatabase,
  createTemplate,
  listAllTemplates,
  searchTemplates,
  filterByTags,
  updateTemplate,
  deleteTemplate,
  getAllTags,
  serviceWorkerExample,
  popupExample,
  errorHandlingExample,
  complexQuery,
  exportTemplates,
  importTemplates,
  clearAllTemplates
};
