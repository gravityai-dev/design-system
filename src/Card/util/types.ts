/**
 * Card Component Types
 */

export interface CardConfig {
  title?: string;
  description?: string;
  imageUrl?: string;
  template?: {
    html?: string;
    css?: string;
    tokens?: Record<string, string>;
  };
}

export interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
}

export interface CardTemplate {
  html: string;
  css: string;
  tokens: Record<string, string>;
}

export interface ComponentSpec {
  type: string;
  version: string;
  props: CardProps;
  template: CardTemplate;
  metadata: {
    dataSource: string;
    nodeId: string;
    executionId: string;
  };
}

export interface CardOutput {
  __outputs: {
    componentSpec: ComponentSpec;
  };
}
