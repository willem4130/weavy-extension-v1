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
            className="btn-icon-card btn-edit"
            title="Edit template"
            aria-label="Edit template"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M12.854 1.854a.5.5 0 0 0-.708 0L10.5 3.5 12.5 5.5l1.646-1.646a.5.5 0 0 0 0-.708l-1.292-1.292zM10 4l-8 8V14h2l8-8L10 4z"/>
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="btn-icon-card btn-delete"
            title="Delete template"
            aria-label="Delete template"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
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
