/**
 * Type definitions for Design System
 */

export interface ComponentSpec {
  type: string;
  props?: Record<string, any>;
  children?: ComponentSpecChild[];
  metadata?: ComponentMetadata;
}

export type ComponentSpecChild = ComponentSpec | TextContent;

export interface TextContent {
  text: string;
}

export interface ComponentMetadata {
  aiContext?: string;
  dataSource?: string;
  confidence?: number;
  tier?: 1 | 2 | 3;
  streaming?: boolean;
}

export interface DesignTokens {
  [key: string]: string;
}

export interface DesignSystemConfig {
  apiUrl: string;
  cacheStrategy?: 'aggressive' | 'normal' | 'none';
  theme?: DesignTokens;
}

export interface ComponentDefinition {
  id: string;
  version: string;
  html?: string;
  css?: string;
  tokens?: DesignTokens;
}
