/**
 * TemplateList Component
 * Grid layout of template cards with empty state
 */

import { Template } from '../../shared/types';
import TemplateCard from './TemplateCard';

interface TemplateListProps {
  templates: Template[];
  loading?: boolean;
  onEdit: (template: Template) => void;
  onDelete: (id: string) => void;
  onCopy: (id: string) => void;
  onCreate?: () => void;
}

function LoadingSkeleton() {
  return (
    <div className="templates-grid">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text" />
          <div className="skeleton" style={{ height: '40px', marginTop: 'var(--spacing-4)' }} />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate?: () => void }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" role="img" aria-label="Templates">
        📋
      </div>
      <h2 className="empty-state-title">No templates yet</h2>
      <p className="empty-state-description">
        Create your first template by pasting JSON from Weavy.ai
      </p>
      {onCreate && (
        <button
          onClick={onCreate}
          className="btn btn-primary"
        >
          Create Template
        </button>
      )}
    </div>
  );
}

export default function TemplateList({
  templates,
  loading = false,
  onEdit,
  onDelete,
  onCopy,
  onCreate
}: TemplateListProps) {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (templates.length === 0) {
    return <EmptyState onCreate={onCreate} />;
  }

  return (
    <div className="templates-grid">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onEdit={() => onEdit(template)}
          onDelete={() => onDelete(template.id)}
          onCopy={() => onCopy(template.id)}
        />
      ))}
    </div>
  );
}
