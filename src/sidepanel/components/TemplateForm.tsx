/**
 * TemplateForm Component
 * Create or edit templates with JSON validation
 */

import { useState, useEffect } from 'react';
import { Template, Node, Edge } from '../../shared/types';

interface TemplateFormProps {
  template?: Template;
  availableTags?: string[];
  onSave: (data: TemplateFormData) => Promise<void>;
  onCancel: () => void;
}

export interface TemplateFormData {
  name: string;
  description?: string;
  tags: string[];
  data: { nodes: Node[]; edges: Edge[] };
}

export default function TemplateForm({ template, availableTags = [], onSave, onCancel }: TemplateFormProps) {
  const isEditMode = !!template;

  const [name, setName] = useState(template?.name || '');
  const [description, setDescription] = useState(template?.description || '');
  const [jsonInput, setJsonInput] = useState(
    template ? JSON.stringify(template.data, null, 2) : ''
  );
  const [tags, setTags] = useState<string[]>(template?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [tagInputFocused, setTagInputFocused] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [preview, setPreview] = useState<{ nodes: number; edges: number } | null>(
    template ? { nodes: template.data.nodes.length, edges: template.data.edges.length } : null
  );
  const [saving, setSaving] = useState(false);

  // Filter tag suggestions based on input or show all when focused
  useEffect(() => {
    // When focused with no input, show all available tags
    if (tagInputFocused && !tagInput.trim()) {
      const available = availableTags
        .filter((tag) => !tags.includes(tag))
        .slice(0, 10); // Show more tags when browsing
      setTagSuggestions(available);
      setShowSuggestions(available.length > 0);
      return;
    }

    // When typing, filter tags
    if (tagInput.trim()) {
      const input = tagInput.toLowerCase();
      const filtered = availableTags
        .filter((tag) =>
          tag.toLowerCase().includes(input) &&
          !tags.includes(tag)
        )
        .slice(0, 5); // Limit to 5 when filtering

      setTagSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      return;
    }

    // When not focused and no input, hide suggestions
    setTagSuggestions([]);
    setShowSuggestions(false);
  }, [tagInput, tags, availableTags, tagInputFocused]);

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

    // JSON is now always required (both create and edit modes)
    if (!jsonInput.trim()) {
      newErrors.json = 'JSON data is required';
    } else {
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

  const handleAddTag = (tagToAdd?: string) => {
    const tag = (tagToAdd || tagInput).trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag]);
      setTagInput('');
      setShowSuggestions(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (tag: string) => {
    handleAddTag(tag);
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
            Template Data (JSON) <span className="text-danger">*</span>
          </label>
          <textarea
            id="json-input"
            className={`textarea ${errors.json ? 'input-error' : ''}`}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='{"nodes": [...], "edges": [...]}'
            rows={8}
            style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-sm)' }}
          />
          {errors.json && <p className="form-error">{errors.json}</p>}
          {preview && (
            <p className="form-hint text-success">
              ✓ Valid JSON: {preview.nodes} nodes, {preview.edges} edges
            </p>
          )}
          {isEditMode && (
            <p className="form-hint">
              You can edit or replace the template code. Changes will be saved when you click Update Template.
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
            onChange={(e) => {
              const newName = e.target.value;
              setName(newName);
              // Live validation - clear error immediately when valid
              if (newName.trim().length >= 3) {
                setErrors((prev) => ({ ...prev, name: '' }));
              } else if (newName.trim().length > 0) {
                setErrors((prev) => ({ ...prev, name: 'Name must be at least 3 characters' }));
              }
            }}
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
        <div className="form-group" style={{ position: 'relative' }}>
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
              onFocus={() => setTagInputFocused(true)}
              onBlur={() => {
                // Delay to allow clicking on suggestions
                setTimeout(() => setTagInputFocused(false), 200);
              }}
              placeholder="Type to search or browse all tags"
              maxLength={20}
              disabled={tags.length >= 10}
            />
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleAddTag()}
              disabled={!tagInput.trim() || tags.length >= 10}
            >
              Add
            </button>
          </div>

          {/* Tag Suggestions Dropdown */}
          {showSuggestions && tagSuggestions.length > 0 && (
            <div className="tag-suggestions">
              <div className="tag-suggestions-header">
                <span className="text-xs text-muted">
                  {tagInput.trim() ? 'Matching tags' : 'All available tags'}
                </span>
              </div>
              {tagSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="tag-suggestion-item"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <span className="tag tag-accent tag-sm">{suggestion}</span>
                  <span className="text-xs text-muted">Click to add</span>
                </button>
              ))}
            </div>
          )}

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
