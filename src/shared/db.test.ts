/**
 * Tests for TemplateDatabase
 * Chrome 139+ Compatible | Manifest V3
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import TemplateDatabase from './db';
import type { Template } from './types';

describe('TemplateDatabase', () => {
  let db: TemplateDatabase;

  beforeEach(async () => {
    db = new TemplateDatabase();
    await db.init();
    await db.clear(); // Start with clean state
  });

  afterEach(async () => {
    await db.clear();
    db.close();
  });

  describe('init', () => {
    it('should initialize database successfully', async () => {
      const newDb = new TemplateDatabase();
      await expect(newDb.init()).resolves.not.toThrow();
      newDb.close();
    });

    it('should be idempotent - safe to call multiple times', async () => {
      await db.init();
      await db.init();
      await db.init();
      const templates = await db.getAll();
      expect(templates).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create template with auto-generated fields', async () => {
      const template = await db.create({
        userId: 'user123',
        name: 'Test Template',
        description: 'A test template',
        tags: ['test', 'example'],
        data: { nodes: [], edges: [] },
        version: 1
      });

      expect(template.id).toBeDefined();
      expect(template.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      expect(template.createdAt).toBeGreaterThan(0);
      expect(template.updatedAt).toBe(template.createdAt);
      expect(template.version).toBe(1);
    });

    it('should create multiple templates with unique IDs', async () => {
      const t1 = await db.create({
        userId: 'user1',
        name: 'Template 1',
        tags: [],
        data: { nodes: [], edges: [] },
        version: 1
      });

      const t2 = await db.create({
        userId: 'user1',
        name: 'Template 2',
        tags: [],
        data: { nodes: [], edges: [] },
        version: 1
      });

      expect(t1.id).not.toBe(t2.id);
    });
  });

  describe('getAll', () => {
    it('should return empty array when no templates exist', async () => {
      const templates = await db.getAll();
      expect(templates).toEqual([]);
    });

    it('should return all templates sorted by createdAt descending', async () => {
      const t1 = await db.create({
        userId: 'user1',
        name: 'First',
        tags: [],
        data: { nodes: [], edges: [] },
        version: 1
      });

      // Wait 10ms to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));

      const t2 = await db.create({
        userId: 'user1',
        name: 'Second',
        tags: [],
        data: { nodes: [], edges: [] },
        version: 1
      });

      const templates = await db.getAll();
      expect(templates).toHaveLength(2);
      expect(templates[0].id).toBe(t2.id); // Newest first
      expect(templates[1].id).toBe(t1.id);
    });
  });

  describe('getById', () => {
    it('should retrieve template by ID', async () => {
      const created = await db.create({
        userId: 'user1',
        name: 'Find Me',
        tags: ['findable'],
        data: { nodes: [], edges: [] },
        version: 1
      });

      const found = await db.getById(created.id);
      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
      expect(found?.name).toBe('Find Me');
    });

    it('should return undefined for non-existent ID', async () => {
      const found = await db.getById('non-existent-id');
      expect(found).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update template and modify updatedAt', async () => {
      const created = await db.create({
        userId: 'user1',
        name: 'Original',
        tags: [],
        data: { nodes: [], edges: [] },
        version: 1
      });

      await new Promise(resolve => setTimeout(resolve, 10));

      const updated = await db.update(created.id, {
        name: 'Updated',
        tags: ['new-tag']
      });

      expect(updated.name).toBe('Updated');
      expect(updated.tags).toContain('new-tag');
      expect(updated.updatedAt).toBeGreaterThan(created.updatedAt);
      expect(updated.createdAt).toBe(created.createdAt); // Should not change
      expect(updated.id).toBe(created.id); // Should not change
    });

    it('should throw error when updating non-existent template', async () => {
      await expect(
        db.update('non-existent', { name: 'New Name' })
      ).rejects.toThrow('Template not found');
    });
  });

  describe('delete', () => {
    it('should delete template by ID', async () => {
      const created = await db.create({
        userId: 'user1',
        name: 'Delete Me',
        tags: [],
        data: { nodes: [], edges: [] },
        version: 1
      });

      await db.delete(created.id);

      const found = await db.getById(created.id);
      expect(found).toBeUndefined();
    });

    it('should not throw when deleting non-existent template', async () => {
      await expect(db.delete('non-existent')).resolves.not.toThrow();
    });
  });

  describe('search', () => {
    beforeEach(async () => {
      await db.create({
        userId: 'user1',
        name: 'React Dashboard',
        description: 'A beautiful dashboard built with React',
        tags: ['react'],
        data: { nodes: [], edges: [] },
        version: 1
      });

      await db.create({
        userId: 'user1',
        name: 'Vue Component',
        description: 'Reusable Vue component',
        tags: ['vue'],
        data: { nodes: [], edges: [] },
        version: 1
      });

      await db.create({
        userId: 'user1',
        name: 'Angular Service',
        description: 'Service layer with React integration',
        tags: ['angular'],
        data: { nodes: [], edges: [] },
        version: 1
      });
    });

    it('should search by name (case-insensitive)', async () => {
      const results = await db.search('react');
      expect(results).toHaveLength(2); // React Dashboard + Angular Service (description)
    });

    it('should search by description', async () => {
      const results = await db.search('beautiful');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('React Dashboard');
    });

    it('should return empty array for no matches', async () => {
      const results = await db.search('nonexistent');
      expect(results).toEqual([]);
    });

    it('should perform case-insensitive search', async () => {
      const results = await db.search('REACT');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('filterByTags', () => {
    beforeEach(async () => {
      await db.create({
        userId: 'user1',
        name: 'Template 1',
        tags: ['typescript', 'react'],
        data: { nodes: [], edges: [] },
        version: 1
      });

      await db.create({
        userId: 'user1',
        name: 'Template 2',
        tags: ['typescript', 'vue'],
        data: { nodes: [], edges: [] },
        version: 1
      });

      await db.create({
        userId: 'user1',
        name: 'Template 3',
        tags: ['javascript', 'react'],
        data: { nodes: [], edges: [] },
        version: 1
      });
    });

    it('should filter templates by single tag', async () => {
      const results = await db.filterByTags(['typescript']);
      expect(results).toHaveLength(2);
    });

    it('should filter templates by multiple tags (OR logic)', async () => {
      const results = await db.filterByTags(['react', 'vue']);
      expect(results).toHaveLength(3); // All three have either react or vue
    });

    it('should return empty array for empty tag list', async () => {
      const results = await db.filterByTags([]);
      expect(results).toEqual([]);
    });

    it('should return unique templates when tag matches multiple times', async () => {
      const results = await db.filterByTags(['typescript', 'react']);
      const uniqueIds = new Set(results.map(t => t.id));
      expect(results.length).toBe(uniqueIds.size);
    });
  });

  describe('getAllTags', () => {
    it('should return empty array when no templates exist', async () => {
      const tags = await db.getAllTags();
      expect(tags).toEqual([]);
    });

    it('should return unique tags sorted alphabetically', async () => {
      await db.create({
        userId: 'user1',
        name: 'Template 1',
        tags: ['zebra', 'apple'],
        data: { nodes: [], edges: [] },
        version: 1
      });

      await db.create({
        userId: 'user1',
        name: 'Template 2',
        tags: ['banana', 'apple'],
        data: { nodes: [], edges: [] },
        version: 1
      });

      const tags = await db.getAllTags();
      expect(tags).toEqual(['apple', 'banana', 'zebra']);
    });

    it('should not include duplicate tags', async () => {
      await db.create({
        userId: 'user1',
        name: 'Template 1',
        tags: ['test', 'test', 'test'],
        data: { nodes: [], edges: [] },
        version: 1
      });

      const tags = await db.getAllTags();
      expect(tags).toEqual(['test']);
    });
  });

  describe('clear', () => {
    it('should remove all templates', async () => {
      await db.create({
        userId: 'user1',
        name: 'Template 1',
        tags: [],
        data: { nodes: [], edges: [] },
        version: 1
      });

      await db.create({
        userId: 'user1',
        name: 'Template 2',
        tags: [],
        data: { nodes: [], edges: [] },
        version: 1
      });

      await db.clear();

      const templates = await db.getAll();
      expect(templates).toEqual([]);
    });
  });

  describe('error handling', () => {
    it('should throw error when operating on uninitialized database', async () => {
      const uninitDb = new TemplateDatabase();
      await expect(uninitDb.getAll()).rejects.toThrow('Database not initialized');
    });
  });
});
