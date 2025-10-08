/**
 * TemplateForm Component
 * Create or edit templates with JSON validation
 */

import { useState, useEffect } from 'react';
import { Template, Node, Edge } from '../../shared/types';

interface TemplateFormProps {
  template?: Template;
  onSave: (data: TemplateFormData) => Promise<void>;
  onCancel: () => void;
}

export interface TemplateFormData {
  name: string;
  description?: string;
  tags: string[];
  data: { nodes: Node[]; edges: Edge[] };
}

export default function TemplateForm({ template, onSave, onCancel }: TemplateFormProps) {
  const isEditMode = !!template;

  const [name, setName] = useState(template?.name || '');
  const [description, setDescription] = useState(template?.description || '');
  const [jsonInput, setJsonInput] = useState(
    template ? JSON.stringify(template.data, null, 2) : ''
  );
  const [tags, setTags] = useState<string[]>(template?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [preview, setPreview] = useState<{ nodes: number; edges: number } | null>(
    template ? { nodes: template.data.nodes.length, edges: template.data.edges.length } : null
  );
  const [saving, setSaving] = useState(false);

  // Validate JSON on change
  useEffect(() => {
    if (!jsonInput.trim()) {
      setPreview(null);
      setErrors((prev) => ({ ...prev, json: '' }));
      return;
    }

    try {
      const data = JSON.parse(jsonInput);

      if (!data.nodes || !Array.isArray(data.nodes)) {
        setErrors((prev) => ({ ...prev, json: 'JSON must have "nodes" array' }));
        setPreview(null);
        return;
      }

      if (!data.edges || !Array.isArray(data.edges)) {
        setErrors((prev) => ({ ...prev, json: 'JSON must have "edges" array' }));
        setPreview(null);
        return;
      }

      setPreview({ nodes: data.nodes.length, edges: data.edges.length });
      setErrors((prev) => ({ ...prev, json: '' }));
    } catch (e) {
      setErrors((prev) => ({ ...prev, json: 'Invalid JSON format' }));
      setPreview(null);
    }
  }, [jsonInput]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!isEditMode && !jsonInput.trim()) {
      newErrors.json = 'JSON data is required';
    }

    if (jsonInput.trim()) {
      try {
        const data = JSON.parse(jsonInput);
        if (!data.nodes || !Array.isArray(data.nodes)) {
          newErrors.json = 'JSON must have "nodes" array';
        }
        if (!data.edges || !Array.isArray(data.edges)) {
          newErrors.json = 'JSON must have "edges" array';
        }
      } catch {
        newErrors.json = 'Invalid JSON format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const data = JSON.parse(jsonInput);
      await onSave({
        name: name.trim(),
        description: description.trim() || undefined,
        tags,
        data: {
          nodes: data.nodes,
          edges: data.edges
        }
      });
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to save template' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="template-form">
      <header className="form-header">
        <h1 className="heading-xl">{isEditMode ? 'Edit Template' : 'Create Template'}</h1>
        <p className="text-secondary">
          {isEditMode
            ? 'Update template details'
            : 'Paste JSON from Weavy.ai and add details'}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="form">
        {/* JSON Input */}
        <div className="form-group">
          <label htmlFor="json-input" className="form-label">
            Template Data (JSON) {!isEditMode && <span className="text-danger">*</span>}
          </label>
          <textarea
            id="json-input"
            className={`textarea ${errors.json ? 'input-error' : ''}`}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='{"nodes": [...], "edges": [...]}'
            rows={8}
            disabled={isEditMode}
            style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-sm)' }}
          />
          {errors.json && <p className="form-error">{errors.json}</p>}
          {preview && (
            <p className="form-hint text-success">
              ✓ Valid JSON: {preview.nodes} nodes, {preview.edges} edges
            </p>
          )}
        </div>

        {/* Name Input */}
        <div className="form-group">
          <label htmlFor="name-input" className="form-label">
            Template Name <span className="text-danger">*</span>
          </label>
          <input
            id="name-input"
            type="text"
            className={`input ${errors.name ? 'input-error' : ''}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., RAG Pipeline Template"
            maxLength={100}
          />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>

        {/* Description Input */}
        <div className="form-group">
          <label htmlFor="description-input" className="form-label">
            Description (Optional)
          </label>
          <textarea
            id="description-input"
            className="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this template do?"
            rows={3}
            maxLength={500}
          />
        </div>

        {/* Tags Input */}
        <div className="form-group">
          <label htmlFor="tag-input" className="form-label">
            Tags (Optional)
          </label>
          <div className="input-group">
            <input
              id="tag-input"
              type="text"
              className="input"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Add tag (press Enter)"
              maxLength={20}
              disabled={tags.length >= 10}
            />
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleAddTag}
              disabled={!tagInput.trim() || tags.length >= 10}
            >
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="tags" style={{ marginTop: 'var(--spacing-2)' }}>
              {tags.map((tag) => (
                <span key={tag} className="tag tag-removable tag-accent">
                  {tag}
                  <button
                    type="button"
                    className="tag-remove"
                    onClick={() => handleRemoveTag(tag)}
                    aria-label={`Remove ${tag} tag`}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
          {tags.length >= 10 && (
            <p className="form-hint">Maximum 10 tags</p>
          )}
        </div>

        {/* Error Display */}
        {errors.submit && (
          <div className="alert alert-danger">
            {errors.submit}
          </div>
        )}

        {/* Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving || Object.keys(errors).some((key) => key !== 'submit' && errors[key])}
          >
            {saving ? (
              <>
                <span className="spinner" />
                Saving...
              </>
            ) : (
              <>{isEditMode ? 'Update Template' : 'Create Template'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
