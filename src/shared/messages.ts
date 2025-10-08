/**
 * Message passing types for Chrome extension communication
 * Service Worker <-> Content Script <-> Popup
 */

import { Template, Node, Edge } from './types';

export enum MessageType {
  // Popup -> Service Worker
  SAVE_TEMPLATE = 'SAVE_TEMPLATE',
  GET_TEMPLATES = 'GET_TEMPLATES',
  DELETE_TEMPLATE = 'DELETE_TEMPLATE',
  UPDATE_TEMPLATE = 'UPDATE_TEMPLATE',
  COPY_TEMPLATE = 'COPY_TEMPLATE',
  SEARCH_TEMPLATES = 'SEARCH_TEMPLATES',
  FILTER_BY_TAGS = 'FILTER_BY_TAGS',
  GET_ALL_TAGS = 'GET_ALL_TAGS',
  EXPORT_TEMPLATES = 'EXPORT_TEMPLATES',
  IMPORT_TEMPLATES = 'IMPORT_TEMPLATES',
  CLEAR_ALL_TEMPLATES = 'CLEAR_ALL_TEMPLATES',

  // Service Worker -> Content Script (legacy, may not be needed)
  PASTE_TEMPLATE = 'PASTE_TEMPLATE',
  GET_SELECTION = 'GET_SELECTION',

  // Responses
  TEMPLATE_SAVED = 'TEMPLATE_SAVED',
  TEMPLATE_COPIED = 'TEMPLATE_COPIED',
  TEMPLATES_LIST = 'TEMPLATES_LIST',
  SELECTION_DATA = 'SELECTION_DATA',
  TAGS_LIST = 'TAGS_LIST',
  EXPORT_DATA = 'EXPORT_DATA',
  IMPORT_COMPLETE = 'IMPORT_COMPLETE',
  ERROR = 'ERROR'
}

export interface BaseMessage {
  type: MessageType;
  timestamp: number;
}

export interface SaveTemplateMessage extends BaseMessage {
  type: MessageType.SAVE_TEMPLATE;
  payload: {
    name: string;
    description?: string;
    tags: string[];
    nodes: Node[];
    edges: Edge[];
  };
}

export interface GetTemplatesMessage extends BaseMessage {
  type: MessageType.GET_TEMPLATES;
  payload?: {
    tags?: string[];
    searchQuery?: string;
  };
}

export interface DeleteTemplateMessage extends BaseMessage {
  type: MessageType.DELETE_TEMPLATE;
  payload: {
    templateId: string;
  };
}

export interface UpdateTemplateMessage extends BaseMessage {
  type: MessageType.UPDATE_TEMPLATE;
  payload: {
    templateId: string;
    updates: Partial<Template>;
  };
}

export interface PasteTemplateMessage extends BaseMessage {
  type: MessageType.PASTE_TEMPLATE;
  payload: {
    template: Template;
  };
}

export interface GetSelectionMessage extends BaseMessage {
  type: MessageType.GET_SELECTION;
}

export interface TemplateSavedMessage extends BaseMessage {
  type: MessageType.TEMPLATE_SAVED;
  payload: {
    template: Template;
  };
}

export interface TemplatesListMessage extends BaseMessage {
  type: MessageType.TEMPLATES_LIST;
  payload: {
    templates: Template[];
  };
}

export interface SelectionDataMessage extends BaseMessage {
  type: MessageType.SELECTION_DATA;
  payload: {
    nodes: Node[];
    edges: Edge[];
  } | null;
}

export interface CopyTemplateMessage extends BaseMessage {
  type: MessageType.COPY_TEMPLATE;
  payload: {
    templateId: string;
  };
}

export interface TemplateCopiedMessage extends BaseMessage {
  type: MessageType.TEMPLATE_COPIED;
  payload: {
    success: boolean;
  };
}

export interface SearchTemplatesMessage extends BaseMessage {
  type: MessageType.SEARCH_TEMPLATES;
  payload: {
    query: string;
  };
}

export interface FilterByTagsMessage extends BaseMessage {
  type: MessageType.FILTER_BY_TAGS;
  payload: {
    tags: string[];
  };
}

export interface GetAllTagsMessage extends BaseMessage {
  type: MessageType.GET_ALL_TAGS;
}

export interface TagsListMessage extends BaseMessage {
  type: MessageType.TAGS_LIST;
  payload: {
    tags: string[];
  };
}

export interface ExportTemplatesMessage extends BaseMessage {
  type: MessageType.EXPORT_TEMPLATES;
}

export interface ExportDataMessage extends BaseMessage {
  type: MessageType.EXPORT_DATA;
  payload: {
    version: string;
    exportDate: number;
    templateCount: number;
    templates: Template[];
  };
}

export interface ImportTemplatesMessage extends BaseMessage {
  type: MessageType.IMPORT_TEMPLATES;
  payload: {
    data: string; // JSON string
  };
}

export interface ImportCompleteMessage extends BaseMessage {
  type: MessageType.IMPORT_COMPLETE;
  payload: {
    imported: number;
    failed: number;
  };
}

export interface ClearAllTemplatesMessage extends BaseMessage {
  type: MessageType.CLEAR_ALL_TEMPLATES;
}

export interface ErrorMessage extends BaseMessage {
  type: MessageType.ERROR;
  payload: {
    error: string;
    details?: any;
  };
}

export type ExtensionMessage =
  | SaveTemplateMessage
  | GetTemplatesMessage
  | DeleteTemplateMessage
  | UpdateTemplateMessage
  | CopyTemplateMessage
  | SearchTemplatesMessage
  | FilterByTagsMessage
  | GetAllTagsMessage
  | ExportTemplatesMessage
  | ImportTemplatesMessage
  | ClearAllTemplatesMessage
  | PasteTemplateMessage
  | GetSelectionMessage
  | TemplateSavedMessage
  | TemplateCopiedMessage
  | TemplatesListMessage
  | SelectionDataMessage
  | TagsListMessage
  | ExportDataMessage
  | ImportCompleteMessage
  | ErrorMessage;
