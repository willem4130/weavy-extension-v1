/**
 * TemplateCard Component
 * Displays individual template with actions
 * Now includes size monitoring and visual indicators
 */

import { Template } from '../../shared/types';
import {
  getTemplateSize,
  formatBytes,
  getTemplateSizeCategory
} from '../../shared/storage-utils';

interface TemplateCardProps {
  template: Template;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: () => void;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

export default function TemplateCard({ template, onEdit, onDelete, onCopy }: TemplateCardProps) {
  // Calculate template size and get visual indicator
  const templateSize = getTemplateSize(template);
  const sizeInfo = getTemplateSizeCategory(templateSize);
  const sizeFormatted = formatBytes(templateSize);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onCopy();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopy();
  };

  return (
    <div
      className="card card-hover template-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCopy();
        }
      }}
    >
      <div className="card-header">
        <h3 className="card-title">{template.name}</h3>
        <div className="card-actions">
          <button
            onClick={handleEdit}
            className="btn-icon btn-ghost"
            title="Edit template"
            aria-label="Edit template"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="btn-icon btn-ghost btn-danger"
            title="Delete template"
            aria-label="Delete template"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="card-body">
        {template.description && (
          <p className="text-secondary template-description">
            {template.description}
          </p>
        )}

        <div className="template-meta">
          <span className="badge">{template.data.nodes.length} nodes</span>
          <span className="badge">{template.data.edges.length} edges</span>
          <span
            className="badge"
            style={{
              backgroundColor: `${sizeInfo.color}22`,
              color: sizeInfo.color,
              borderColor: sizeInfo.color
            }}
            title={`Template size: ${sizeFormatted} (${sizeInfo.category})`}
          >
            {sizeInfo.icon} {sizeFormatted}
          </span>
          <span className="text-muted text-xs">{formatDate(template.createdAt)}</span>
        </div>

        {template.tags.length > 0 && (
          <div className="tags">
            {template.tags.map((tag) => (
              <span key={tag} className="tag tag-accent">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="card-footer">
        <button
          onClick={handleCopy}
          className="btn btn-primary w-full"
        >
          📋 Copy to Clipboard
        </button>
      </div>
    </div>
  );
}
