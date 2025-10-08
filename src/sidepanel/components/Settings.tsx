/**
 * Settings Component
 * Export/Import templates and manage preferences
 */

import { useState, useEffect } from 'react';
import { MessageType } from '../../shared/messages';

interface SettingsProps {
  onBack: () => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function Settings({ onBack, onShowToast }: SettingsProps) {
  const [stats, setStats] = useState({
    templateCount: 0,
    totalNodes: 0,
    totalEdges: 0
  });
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
    loadSettings();
  }, []);

  const loadStats = async () => {
    try {
      const response = await chrome.runtime.sendMessage({
        type: MessageType.GET_TEMPLATES,
        timestamp: Date.now()
      });

      const templates = response.payload?.templates || [];
      const totalNodes = templates.reduce((sum: number, t: any) => sum + t.data.nodes.length, 0);
      const totalEdges = templates.reduce((sum: number, t: any) => sum + t.data.edges.length, 0);

      setStats({
        templateCount: templates.length,
        totalNodes,
        totalEdges
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const result = await chrome.storage.local.get(['settings']);
      setUserId(result.settings?.userId || 'Unknown');
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);

      const response = await chrome.runtime.sendMessage({
        type: MessageType.EXPORT_TEMPLATES,
        timestamp: Date.now()
      });

      const exportData = response.payload;
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `weavy-templates-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      onShowToast(`Exported ${exportData.templateCount} templates`, 'success');
    } catch (error) {
      onShowToast('Failed to export templates', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);

      const fileContent = await file.text();

      const response = await chrome.runtime.sendMessage({
        type: MessageType.IMPORT_TEMPLATES,
        timestamp: Date.now(),
        payload: { data: fileContent }
      });

      const { imported, failed } = response.payload;

      if (imported > 0) {
        onShowToast(`Imported ${imported} templates${failed > 0 ? `, ${failed} failed` : ''}`, 'success');
        loadStats();
      } else {
        onShowToast('No templates imported', 'error');
      }
    } catch (error) {
      onShowToast('Failed to import templates', 'error');
    } finally {
      setLoading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to delete ALL templates? This cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);

      await chrome.runtime.sendMessage({
        type: MessageType.CLEAR_ALL_TEMPLATES,
        timestamp: Date.now()
      });

      onShowToast('All templates deleted', 'success');
      loadStats();
    } catch (error) {
      onShowToast('Failed to clear templates', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <header className="page-header">
        <button
          onClick={onBack}
          className="btn btn-ghost btn-sm"
          aria-label="Go back"
        >
          ← Back
        </button>
        <h1 className="heading-xl">Settings</h1>
      </header>

      <div className="settings-content">
        {/* Statistics Section */}
        <section className="settings-section">
          <h2 className="heading-lg">Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.templateCount}</div>
              <div className="stat-label">Templates</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalNodes}</div>
              <div className="stat-label">Total Nodes</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalEdges}</div>
              <div className="stat-label">Total Edges</div>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* Data Management Section */}
        <section className="settings-section">
          <h2 className="heading-lg">Data Management</h2>
          <div className="settings-actions">
            <button
              className="btn btn-primary w-full"
              onClick={handleExport}
              disabled={loading || stats.templateCount === 0}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Processing...
                </>
              ) : (
                <>📥 Export All Templates</>
              )}
            </button>

            <label className="btn btn-secondary w-full">
              📤 Import Templates
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={loading}
                style={{ display: 'none' }}
              />
            </label>

            <button
              className="btn btn-danger w-full"
              onClick={handleClearAll}
              disabled={loading || stats.templateCount === 0}
            >
              🗑️ Clear All Templates
            </button>
          </div>
        </section>

        <div className="divider" />

        {/* Information Section */}
        <section className="settings-section">
          <h2 className="heading-lg">Information</h2>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Version</span>
              <span className="info-value">1.0.0</span>
            </div>
            <div className="info-item">
              <span className="info-label">User ID</span>
              <span className="info-value text-xs text-muted">{userId.substring(0, 8)}...</span>
            </div>
            <div className="info-item">
              <span className="info-label">Storage</span>
              <span className="info-value">IndexedDB</span>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* Help Section */}
        <section className="settings-section">
          <h2 className="heading-lg">Help</h2>
          <div className="help-text text-sm text-secondary">
            <p>
              This extension helps you save and manage workflow templates from Weavy.ai.
              Select nodes and edges on the canvas, then save them as reusable templates.
            </p>
            <p style={{ marginTop: 'var(--spacing-2)' }}>
              Templates are stored locally in your browser using IndexedDB.
              Export your templates regularly to back them up.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
