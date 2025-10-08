/**
 * IndexedDB wrapper for Weavy Template Manager
 * Chrome 139+ Compatible | Manifest V3
 *
 * Provides type-safe database operations for template storage
 */

import type { Template } from './types';

const DB_NAME = 'WeavyTemplates';
const DB_VERSION = 1;
const STORE_NAME = 'templates';

/**
 * Type-safe IndexedDB wrapper for template management
 */
class TemplateDatabase {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  /**
   * Initialize the IndexedDB database
   * Creates object store and indexes if they don't exist
   * Safe to call multiple times - returns same promise if already initializing
   */
  async init(): Promise<void> {
    // Return existing initialization if in progress
    if (this.initPromise) {
      return this.initPromise;
    }

    // Return immediately if already initialized
    if (this.db) {
      return Promise.resolve();
    }

    this.initPromise = new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        this.initPromise = null;
        reject(new Error(`Failed to open database: ${request.error?.message}`));
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.initPromise = null;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });

          // Create indexes
          store.createIndex('userId', 'userId', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
          store.createIndex('name', 'name', { unique: false });
          store.createIndex('tags', 'tags', { unique: false, multiEntry: true });
        }
      };
    });

    return this.initPromise;
  }

  /**
   * Ensures database is initialized before operation
   * @throws Error if database is not initialized
   */
  private ensureInitialized(): IDBDatabase {
    if (!this.db) {
      throw new Error('Database not initialized. Call init() first.');
    }
    return this.db;
  }

  /**
   * Create a new template
   * Auto-generates ID, createdAt, updatedAt, and version
   *
   * @param template - Template data without id, timestamps, and version
   * @returns Created template with generated fields
   */
  async create(template: Omit<Template, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<Template> {
    const db = this.ensureInitialized();

    const now = Date.now();
    const newTemplate: Template = {
      ...template,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(newTemplate);

      request.onsuccess = () => resolve(newTemplate);
      request.onerror = () => reject(new Error(`Failed to create template: ${request.error?.message}`));
    });
  }

  /**
   * Get all templates from the database
   * Sorted by createdAt descending (newest first)
   *
   * @returns Array of all templates
   */
  async getAll(): Promise<Template[]> {
    const db = this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const templates = request.result as Template[];
        // Sort by createdAt descending (newest first)
        templates.sort((a, b) => b.createdAt - a.createdAt);
        resolve(templates);
      };
      request.onerror = () => reject(new Error(`Failed to get all templates: ${request.error?.message}`));
    });
  }

  /**
   * Get a template by its ID
   *
   * @param id - Template UUID
   * @returns Template if found, undefined otherwise
   */
  async getById(id: string): Promise<Template | undefined> {
    const db = this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result as Template | undefined);
      request.onerror = () => reject(new Error(`Failed to get template: ${request.error?.message}`));
    });
  }

  /**
   * Update an existing template
   * Auto-updates updatedAt timestamp
   *
   * @param id - Template UUID
   * @param updates - Partial template data to update
   * @returns Updated template
   * @throws Error if template not found
   */
  async update(id: string, updates: Partial<Template>): Promise<Template> {
    const db = this.ensureInitialized();

    return new Promise(async (resolve, reject) => {
      try {
        const existing = await this.getById(id);
        if (!existing) {
          reject(new Error(`Template not found: ${id}`));
          return;
        }

        const updated: Template = {
          ...existing,
          ...updates,
          id, // Prevent ID change
          createdAt: existing.createdAt, // Prevent createdAt change
          updatedAt: Date.now()
        };

        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(updated);

        request.onsuccess = () => resolve(updated);
        request.onerror = () => reject(new Error(`Failed to update template: ${request.error?.message}`));
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Delete a template by ID
   *
   * @param id - Template UUID
   */
  async delete(id: string): Promise<void> {
    const db = this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to delete template: ${request.error?.message}`));
    });
  }

  /**
   * Search templates by name or description
   * Case-insensitive partial match
   *
   * @param query - Search query string
   * @returns Matching templates
   */
  async search(query: string): Promise<Template[]> {
    const db = this.ensureInitialized();
    const lowerQuery = query.toLowerCase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const templates = request.result as Template[];
        const matches = templates.filter(template => {
          const nameMatch = template.name.toLowerCase().includes(lowerQuery);
          const descMatch = template.description?.toLowerCase().includes(lowerQuery) ?? false;
          return nameMatch || descMatch;
        });
        // Sort by createdAt descending
        matches.sort((a, b) => b.createdAt - a.createdAt);
        resolve(matches);
      };
      request.onerror = () => reject(new Error(`Failed to search templates: ${request.error?.message}`));
    });
  }

  /**
   * Filter templates by tags
   * Returns templates that have ANY of the specified tags
   *
   * @param tags - Array of tag strings
   * @returns Templates matching any of the tags
   */
  async filterByTags(tags: string[]): Promise<Template[]> {
    const db = this.ensureInitialized();

    if (tags.length === 0) {
      return [];
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('tags');

      const results = new Map<string, Template>();
      let completed = 0;

      // Query for each tag
      tags.forEach(tag => {
        const request = index.getAll(tag);

        request.onsuccess = () => {
          const templates = request.result as Template[];
          templates.forEach(template => {
            results.set(template.id, template);
          });

          completed++;
          if (completed === tags.length) {
            const uniqueTemplates = Array.from(results.values());
            // Sort by createdAt descending
            uniqueTemplates.sort((a, b) => b.createdAt - a.createdAt);
            resolve(uniqueTemplates);
          }
        };

        request.onerror = () => reject(new Error(`Failed to filter by tags: ${request.error?.message}`));
      });
    });
  }

  /**
   * Get all unique tags across all templates
   * Sorted alphabetically
   *
   * @returns Array of unique tag strings
   */
  async getAllTags(): Promise<string[]> {
    const db = this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const templates = request.result as Template[];
        const tagSet = new Set<string>();

        templates.forEach(template => {
          template.tags.forEach(tag => tagSet.add(tag));
        });

        const uniqueTags = Array.from(tagSet).sort();
        resolve(uniqueTags);
      };
      request.onerror = () => reject(new Error(`Failed to get all tags: ${request.error?.message}`));
    });
  }

  /**
   * Clear all templates from the database
   * USE WITH CAUTION - This is irreversible
   */
  async clear(): Promise<void> {
    const db = this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to clear templates: ${request.error?.message}`));
    });
  }

  /**
   * Close the database connection
   * Call this when the extension is unloading
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Export class and singleton instance
export default TemplateDatabase;
export const templateDB = new TemplateDatabase();
