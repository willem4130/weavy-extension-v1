/**
 * Storage Utilities for Weavy Template Manager
 * Chrome 139+ | IndexedDB Size Monitoring
 *
 * Provides utilities to monitor storage usage, estimate sizes,
 * and warn about large templates
 */

import type { Template } from './types';

/**
 * Calculate the approximate size of an object in bytes
 * Uses JSON.stringify to get a rough estimate
 */
export function getObjectSize(obj: any): number {
  const jsonString = JSON.stringify(obj);
  // Each character in UTF-16 is 2 bytes
  return new Blob([jsonString]).size;
}

/**
 * Format bytes to human-readable string
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places (default: 2)
 */
export function formatBytes(bytes: number, decimals: 2 = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Calculate template size in bytes
 * Includes all template data (nodes, edges, metadata)
 */
export function getTemplateSize(template: Template): number {
  return getObjectSize(template);
}

/**
 * Get size category for visual indicators
 */
export function getTemplateSizeCategory(bytes: number): {
  category: 'small' | 'medium' | 'large' | 'huge';
  color: string;
  icon: string;
} {
  const kb = bytes / 1024;
  const mb = kb / 1024;

  if (mb >= 10) {
    return { category: 'huge', color: '#ef4444', icon: '🔴' };
  } else if (mb >= 1) {
    return { category: 'large', color: '#f59e0b', icon: '🟠' };
  } else if (kb >= 100) {
    return { category: 'medium', color: '#3b82f6', icon: '🔵' };
  } else {
    return { category: 'small', color: '#10b981', icon: '🟢' };
  }
}

/**
 * Check if template should be compressed
 * Templates over 100KB should be compressed
 */
export function shouldCompress(bytes: number): boolean {
  return bytes > 100 * 1024; // 100KB
}

/**
 * Check if template is considered "large"
 * Large templates (>1MB) trigger warnings
 */
export function isLargeTemplate(bytes: number): boolean {
  return bytes > 1024 * 1024; // 1MB
}

/**
 * Get storage quota information from Chrome
 * Returns estimated usage and available space
 */
export async function getStorageQuota(): Promise<{
  usage: number;
  quota: number;
  usagePercentage: number;
  usageFormatted: string;
  quotaFormatted: string;
}> {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const usagePercentage = quota > 0 ? (usage / quota) * 100 : 0;

      return {
        usage,
        quota,
        usagePercentage: Math.round(usagePercentage * 100) / 100,
        usageFormatted: formatBytes(usage),
        quotaFormatted: formatBytes(quota)
      };
    }
  } catch (error) {
    console.error('Failed to get storage quota:', error);
  }

  return {
    usage: 0,
    quota: 0,
    usagePercentage: 0,
    usageFormatted: '0 Bytes',
    quotaFormatted: 'Unknown'
  };
}

/**
 * Calculate total size of all templates
 */
export function getTotalTemplatesSize(templates: Template[]): {
  totalBytes: number;
  totalFormatted: string;
  averageBytes: number;
  averageFormatted: string;
  largestBytes: number;
  largestFormatted: string;
} {
  const sizes = templates.map(t => getTemplateSize(t));
  const totalBytes = sizes.reduce((sum, size) => sum + size, 0);
  const averageBytes = templates.length > 0 ? totalBytes / templates.length : 0;
  const largestBytes = templates.length > 0 ? Math.max(...sizes) : 0;

  return {
    totalBytes,
    totalFormatted: formatBytes(totalBytes),
    averageBytes,
    averageFormatted: formatBytes(averageBytes),
    largestBytes,
    largestFormatted: formatBytes(largestBytes)
  };
}

/**
 * Get storage recommendations based on current usage
 */
export function getStorageRecommendations(
  templates: Template[],
  quota: { usage: number; quota: number; usagePercentage: number }
): string[] {
  const recommendations: string[] = [];
  const stats = getTotalTemplatesSize(templates);

  // Check for large templates
  const largeTemplates = templates.filter(t => isLargeTemplate(getTemplateSize(t)));
  if (largeTemplates.length > 0) {
    recommendations.push(
      `${largeTemplates.length} template(s) are over 1MB. Consider splitting large workflows.`
    );
  }

  // Check for compressible templates
  const compressibleTemplates = templates.filter(t => shouldCompress(getTemplateSize(t)));
  if (compressibleTemplates.length > 0) {
    recommendations.push(
      `${compressibleTemplates.length} template(s) could benefit from compression.`
    );
  }

  // Check overall usage
  if (quota.usagePercentage > 80) {
    recommendations.push('Storage usage is over 80%. Consider cleaning up old templates.');
  } else if (quota.usagePercentage > 50) {
    recommendations.push('Storage usage is over 50%. Monitor your template sizes.');
  }

  // Check number of templates
  if (templates.length > 100) {
    recommendations.push(
      `You have ${templates.length} templates. Consider archiving old ones.`
    );
  }

  // Check average size
  if (stats.averageBytes > 500 * 1024) {
    recommendations.push(
      `Average template size is ${stats.averageFormatted}. This is quite large for typical workflows.`
    );
  }

  if (recommendations.length === 0) {
    recommendations.push('✓ Storage looks healthy! No recommendations at this time.');
  }

  return recommendations;
}

/**
 * Compress template data using gzip
 * Returns compressed Blob
 */
export async function compressTemplate(template: Template): Promise<Blob> {
  const jsonString = JSON.stringify(template);
  const stream = new Blob([jsonString]).stream();
  const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
  return new Response(compressedStream).blob();
}

/**
 * Decompress template data
 * Returns original template object
 */
export async function decompressTemplate(compressed: Blob): Promise<Template> {
  const stream = compressed.stream();
  const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
  const decompressed = await new Response(decompressedStream).text();
  return JSON.parse(decompressed);
}

/**
 * Calculate compression savings
 * Returns original size, compressed size, and savings percentage
 */
export async function getCompressionSavings(template: Template): Promise<{
  originalSize: number;
  compressedSize: number;
  savingsBytes: number;
  savingsPercentage: number;
  originalFormatted: string;
  compressedFormatted: string;
}> {
  const originalSize = getTemplateSize(template);
  const compressed = await compressTemplate(template);
  const compressedSize = compressed.size;
  const savingsBytes = originalSize - compressedSize;
  const savingsPercentage = ((savingsBytes / originalSize) * 100);

  return {
    originalSize,
    compressedSize,
    savingsBytes,
    savingsPercentage: Math.round(savingsPercentage * 100) / 100,
    originalFormatted: formatBytes(originalSize),
    compressedFormatted: formatBytes(compressedSize)
  };
}
