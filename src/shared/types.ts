/**
 * Core data structures for Weavy Template Manager
 * Chrome 139+ Compatible | Manifest V3
 */

export interface Node {
  id: string;
  isModel: boolean;
  type: string;
  position: { x: number; y: number };
  data: any;
}

export interface Edge {
  id: string;
  type: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  data?: any;
}

export interface Template {
  id: string;              // UUID v4
  userId: string;          // For future multi-user support
  name: string;
  description?: string;
  tags: string[];
  data: {
    nodes: Node[];
    edges: Edge[];
  };
  createdAt: number;       // Unix timestamp
  updatedAt: number;       // Unix timestamp
  version: number;         // For future versioning
}

export interface TemplateMetadata {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  nodeCount: number;
  edgeCount: number;
}
