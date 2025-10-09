/**
 * Popup main component
 * Chrome 139+ | React 19 | TypeScript
 */

import { useEffect, useState, useCallback } from 'react';
import { Template } from '../shared/types';
import { MessageType } from '../shared/messages';
import TemplateList from './components/TemplateList';
import TemplateForm, { TemplateFormData } from './components/TemplateForm';
import SearchFilter from './components/SearchFilter';
import Settings from './components/Settings';
import Toast from './components/Toast';
import ConfirmDialog, { ConfirmDialogProps } from './components/ConfirmDialog';
import './styles/theme.css';
import './popup.css';

type View = 'list' | 'create' | 'edit' | 'settings';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
}

function App() {
  const [view, setView] = useState<View>('list');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<Omit<ConfirmDialogProps, 'onConfirm' | 'onCancel'> | null>(null);
  const [confirmCallback, setConfirmCallback] = useState<(() => void) | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [currentSearch, setCurrentSearch] = useState('');
  const [currentTagFilter, setCurrentTagFilter] = useState<string[]>([]);
  const [currentSort, setCurrentSort] = useState('date');

  useEffect(() => {
    loadTemplates();
    loadTags();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);

      const response = await chrome.runtime.sendMessage({
        type: MessageType.GET_TEMPLATES,
        timestamp: Date.now()
      });

      const loadedTemplates = response.payload?.templates || [];
      setTemplates(loadedTemplates);
      setFilteredTemplates(loadedTemplates);
    } catch (err) {
      console.error('Error loading templates:', err);
      showToast('Failed to load templates', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const response = await chrome.runtime.sendMessage({
        type: MessageType.GET_ALL_TAGS,
        timestamp: Date.now()
      });

      setAvailableTags(response.payload?.tags || []);
    } catch (err) {
      console.error('Error loading tags:', err);
    }
  };

  const showToast = (message: string, type: ToastState['type'] = 'info') => {
    setToast({ message, type });
  };

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    options?: { confirmText?: string; cancelText?: string; danger?: boolean }
  ) => {
    setConfirmDialog({
      title,
      message,
      confirmText: options?.confirmText,
      cancelText: options?.cancelText,
      danger: options?.danger
    });
    setConfirmCallback(() => onConfirm);
  };

  const handleCreate = () => {
    setEditingTemplate(null);
    setView('create');
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setView('edit');
  };

  const handleDelete = async (id: string) => {
    const template = templates.find((t) => t.id === id);
    if (!template) return;

    showConfirm(
      'Delete Template',
      `Are you sure you want to delete "${template.name}"? This cannot be undone.`,
      async () => {
        try {
          await chrome.runtime.sendMessage({
            type: MessageType.DELETE_TEMPLATE,
            timestamp: Date.now(),
            payload: { templateId: id }
          });

          showToast('Template deleted', 'success');
          await loadTemplates();
          await loadTags();
        } catch (err) {
          showToast('Failed to delete template', 'error');
        }
      },
      { confirmText: 'Delete', danger: true }
    );
  };

  const handleCopy = async (id: string) => {
    try {
      const response = await chrome.runtime.sendMessage({
        type: MessageType.COPY_TEMPLATE,
        timestamp: Date.now(),
        payload: { templateId: id }
      });

      // Write to clipboard (service worker returns the data)
      if (response.payload?.data) {
        await navigator.clipboard.writeText(response.payload.data);
        showToast('Copied to clipboard!', 'success');
      } else {
        throw new Error('No data received from service worker');
      }
    } catch (err) {
      showToast('Failed to copy template', 'error');
    }
  };

  const handleSave = async (data: TemplateFormData) => {
    try {
      if (editingTemplate) {
        // Update existing template
        await chrome.runtime.sendMessage({
          type: MessageType.UPDATE_TEMPLATE,
          timestamp: Date.now(),
          payload: {
            templateId: editingTemplate.id,
            updates: {
              name: data.name,
              description: data.description,
              tags: data.tags
            }
          }
        });

        showToast('Template updated', 'success');
      } else {
        // Create new template
        await chrome.runtime.sendMessage({
          type: MessageType.SAVE_TEMPLATE,
          timestamp: Date.now(),
          payload: {
            name: data.name,
            description: data.description,
            tags: data.tags,
            nodes: data.data.nodes,
            edges: data.data.edges
          }
        });

        showToast('Template created', 'success');
      }

      setView('list');
      setEditingTemplate(null);
      await loadTemplates();
      await loadTags();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to save template');
    }
  };

  const handleCancel = () => {
    setView('list');
    setEditingTemplate(null);
  };

  // Search and filter logic
  const applyFiltersAndSort = useCallback(() => {
    let result = [...templates];

    // Apply search
    if (currentSearch) {
      const query = currentSearch.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query)
      );
    }

    // Apply tag filter
    if (currentTagFilter.length > 0) {
      result = result.filter((t) =>
        t.tags.some((tag) => currentTagFilter.includes(tag))
      );
    }

    // Apply sorting
    switch (currentSort) {
      case 'date':
        result.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'date-old':
        result.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'nodes':
        result.sort((a, b) => b.data.nodes.length - a.data.nodes.length);
        break;
    }

    setFilteredTemplates(result);
  }, [templates, currentSearch, currentTagFilter, currentSort]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const handleSearch = (query: string) => {
    setCurrentSearch(query);
  };

  const handleFilterTags = (tags: string[]) => {
    setCurrentTagFilter(tags);
  };

  const handleSort = (sortBy: string) => {
    setCurrentSort(sortBy);
  };

  return (
    <div className="app">
      {/* Header */}
      {view === 'list' && (
        <header className="app-header">
          <div className="header-content">
            <h1 className="heading-2xl">Weavy Templates</h1>
            <p className="text-secondary text-sm">
              {templates.length} template{templates.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="header-actions">
            <button
              onClick={handleCreate}
              className="btn btn-primary"
              aria-label="Create new template"
            >
              + New
            </button>
            <button
              onClick={() => setView('settings')}
              className="btn btn-secondary btn-icon"
              aria-label="Settings"
            >
              ⚙️
            </button>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="app-main">
        {view === 'list' && (
          <>
            {templates.length > 0 && (
              <SearchFilter
                onSearch={handleSearch}
                onFilterTags={handleFilterTags}
                onSort={handleSort}
                availableTags={availableTags}
              />
            )}
            <TemplateList
              templates={filteredTemplates}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCopy={handleCopy}
              onCreate={handleCreate}
            />
          </>
        )}

        {(view === 'create' || view === 'edit') && (
          <TemplateForm
            template={editingTemplate || undefined}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}

        {view === 'settings' && (
          <Settings
            onBack={() => setView('list')}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Footer */}
      {view === 'list' && (
        <footer className="app-footer">
          <p className="text-xs text-muted">Weavy Template Manager v1.0.0</p>
        </footer>
      )}

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && confirmCallback && (
        <ConfirmDialog
          {...confirmDialog}
          onConfirm={() => {
            confirmCallback();
            setConfirmDialog(null);
            setConfirmCallback(null);
          }}
          onCancel={() => {
            setConfirmDialog(null);
            setConfirmCallback(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
