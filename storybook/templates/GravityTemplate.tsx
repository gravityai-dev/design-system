/**
 * GravityTemplate - Base class/interface for all AI templates
 * 
 * All templates MUST extend this to ensure consistent API
 */

import React from "react";

/**
 * Streaming state enum
 */
export enum StreamingState {
  IDLE = 'idle',           // Not started yet
  STREAMING = 'streaming', // Currently streaming
  COMPLETE = 'complete',   // Finished streaming
}

/**
 * Component within an assistant response
 */
export interface ResponseComponent {
  id: string;
  componentType: string;
  componentUrl?: string;
  nodeId?: string;
  chatId?: string;
  props?: Record<string, any>;
  metadata?: Record<string, any>;
  Component?: any; // Loaded React component
}

/**
 * User message - simple text message
 */
export interface UserMessage {
  id: string;
  type: 'user_message';
  role: 'user';
  content: string;
  timestamp: string;
  chatId?: string;
}

/**
 * Assistant response - can contain multiple components
 * Each response has its own streaming state
 */
export interface AssistantResponse {
  id: string;
  type: 'assistant_response';
  role: 'assistant';
  streamingState: StreamingState;
  components: ResponseComponent[];
  timestamp: string;
  chatId?: string;
}

/**
 * History entry from HistoryManager
 * This is what ALL templates receive
 * 
 * Universal structure: Each AI response can contain multiple components
 * and has its own streaming state (not global)
 */
export type HistoryEntry = UserMessage | AssistantResponse;

/**
 * Session parameters for workflow execution
 */
export interface SessionParams {
  conversationId: string;
  chatId: string;
  userId: string;
  workflowId: string;
  targetTriggerNode: string;
}

/**
 * Client context - everything templates need from the client
 */
export interface GravityClient {
  history: {
    entries: HistoryEntry[];
    addUserMessage: (message: string, metadata?: any) => UserMessage;
    addResponse: (responseData?: Partial<AssistantResponse>) => AssistantResponse;
    updateResponse: (id: string, updates: Partial<AssistantResponse>) => AssistantResponse | null;
    addComponentToResponse: (responseId: string, componentData: any, loadedComponent?: any) => AssistantResponse | null;
    getResponses: () => AssistantResponse[];
    // Backward compatibility - deprecated
    addComponent?: (componentData: any, loadedComponent?: any) => AssistantResponse;
    updateEntry?: (id: string, updates: any) => HistoryEntry | null;
  };
  websocket: {
    sendUserAction: (action: string, data: any) => void;
  };
  session: SessionParams;
}

/**
 * Base props that ALL templates must accept
 */
export interface GravityTemplateProps {
  /** Client context with all utilities */
  client: GravityClient;
  
  /** Callback: Template shares state back to client */
  onStateChange?: (state: { streamingState?: StreamingState; [key: string]: any }) => void;
  
  /** Workflow state from Zustand */
  workflowState?: 'WORKFLOW_STARTED' | 'WORKFLOW_COMPLETED' | null;
  workflowId?: string | null;
  workflowRunId?: string | null;
  
  /** Streaming state enum */
  streamingState?: StreamingState;
  
  /** Template-specific props */
  [key: string]: any;
}

/**
 * Base GravityTemplate component
 * All templates should extend this or implement GravityTemplateProps
 */
export abstract class GravityTemplate<P extends GravityTemplateProps = GravityTemplateProps> extends React.Component<P> {
  /**
   * Get only user messages from history
   */
  protected getUserMessages(): UserMessage[] {
    return this.props.history.filter((entry: HistoryEntry): entry is UserMessage => entry.type === 'user_message');
  }

  /**
   * Get only assistant responses from history
   */
  protected getResponses(): AssistantResponse[] {
    return this.props.history.filter((entry: HistoryEntry): entry is AssistantResponse => entry.type === 'assistant_response');
  }

  /**
   * Get history filtered by role
   */
  protected getByRole(role: 'user' | 'assistant'): HistoryEntry[] {
    return this.props.history.filter((entry: HistoryEntry) => entry.role === role);
  }

  /**
   * Get the latest entry
   */
  protected getLatest(): HistoryEntry | null {
    return this.props.history[this.props.history.length - 1] || null;
  }

  /**
   * Check if currently streaming (workflow is running)
   */
  protected get isStreaming(): boolean {
    return this.props.isStreaming || this.props.workflowState === 'WORKFLOW_STARTED';
  }

  /**
   * Get current workflow state
   */
  protected get workflowState(): 'WORKFLOW_STARTED' | 'WORKFLOW_COMPLETED' | null {
    return this.props.workflowState || null;
  }

  /**
   * Check if workflow is completed
   */
  protected get isWorkflowCompleted(): boolean {
    return this.props.workflowState === 'WORKFLOW_COMPLETED';
  }

  /**
   * Send message (calls onSend prop)
   */
  protected sendMessage(message: string): void {
    this.props.onSend?.(message);
  }

  /**
   * Abstract render method - must be implemented by subclasses
   */
  abstract render(): React.ReactNode;
}

/**
 * Functional component version (for hooks-based templates)
 */
export interface GravityTemplateFn<P extends GravityTemplateProps = GravityTemplateProps> {
  (props: P): React.ReactElement | null;
}

/**
 * Hook for interacting with the Gravity client
 * Provides common template functionality
 * 
 * NOTE: This hook needs to be used in a component that has access to Zustand store
 * (typically via props passed from the client app)
 */
export function useGravityClient(
  client: GravityClient, 
  onStateChange?: (state: any) => void
) {
  // Universal send message handler
  const sendMessage = React.useCallback(async (message: string) => {
    // Optimistically set streaming state immediately
    onStateChange?.({ isStreaming: true });
    
    // Add to history and get the entry with generated chatId
    const userEntry = client.history.addUserMessage(message, {
      workflowId: client.session.workflowId,
      targetTriggerNode: client.session.targetTriggerNode,
    });
    
    // Send to server with the chatId for request-response matching
    client.websocket.sendUserAction("send_message", {
      message,
      chatId: userEntry.chatId, // Pass chatId to server
      workflowId: client.session.workflowId,
      targetTriggerNode: client.session.targetTriggerNode,
    });
    
    // Workflow state will be updated via WebSocket WORKFLOW_STATE events
  }, [client, onStateChange]);
  
  return {
    sendMessage,
    history: client.history.entries,
    session: client.session,
  };
}

/**
 * Hook for working with history entries
 * Provides utility methods for filtering and rendering
 */
export function useGravityTemplate(history: HistoryEntry[]) {
  return {
    // Filter by type
    getUserMessages: () => history.filter((entry): entry is UserMessage => entry.type === 'user_message'),
    getResponses: () => history.filter((entry): entry is AssistantResponse => entry.type === 'assistant_response'),
    
    // Filter by role
    getByRole: (role: 'user' | 'assistant') => history.filter(entry => entry.role === role),
    
    // Get specific entries
    getLatest: () => history[history.length - 1] || null,
    getFirst: () => history[0] || null,
    
    // Get all components from all responses
    getAllComponents: () => {
      return history
        .filter((entry): entry is AssistantResponse => entry.type === 'assistant_response')
        .flatMap(response => response.components);
    },
  };
};

/**
 * Check if component matches a type or category
 * Checks componentType, metadata.category, and nodeId
 * 
 * @example
 * isComponentType(c, 'image')
 * isComponentType(c, 'AIResponse')
 */
export function isComponentType(component: ResponseComponent, type: string): boolean {
  const lowerType = type.toLowerCase();
  
  // Check componentType
  if (component.componentType?.toLowerCase().includes(lowerType)) {
    return true;
  }
  
  // Check metadata.category
  if (component.metadata?.category?.toLowerCase().includes(lowerType)) {
    return true;
  }
  
  // Check nodeId
  if (component.nodeId?.toLowerCase().includes(lowerType)) {
    return true;
  }
  
  return false;
}

/**
 * Filter components by type
 * 
 * @param components - Array of components to filter
 * @param options - Filter options
 * @param options.include - Only include these types (e.g., ['image', 'card'])
 * @param options.exclude - Exclude these types (e.g., ['image'])
 * @param options.order - Order by priority (types listed first appear first)
 * 
 * @example
 * // Only images
 * filterComponents(components, { include: ['image'] })
 * 
 * // Everything except images
 * filterComponents(components, { exclude: ['image'] })
 * 
 * // Only AIResponse and Card, AIResponse first
 * filterComponents(components, { include: ['AIResponse', 'Card'], order: true })
 * 
 * // All components, but AIResponse first, then Card, then rest
 * filterComponents(components, { include: ['AIResponse', 'Card', '*'], order: true })
 */
export function filterComponents(
  components: ResponseComponent[],
  options: { include?: string[], exclude?: string[], order?: boolean } = {}
): ResponseComponent[] {
  const { include, exclude, order } = options;
  
  let filtered = components.filter(component => {
    // If include list provided, component must match at least one (or wildcard)
    if (include && include.length > 0) {
      const hasWildcard = include.includes('*');
      if (!hasWildcard) {
        const matches = include.some(type => isComponentType(component, type));
        if (!matches) return false;
      }
    }
    
    // If exclude list provided, component must not match any
    if (exclude && exclude.length > 0) {
      const matches = exclude.some(type => isComponentType(component, type));
      if (matches) return false;
    }
    
    return true;
  });
  
  // Sort by priority if order is true and include list is provided
  if (order && include && include.length > 0) {
    filtered = filtered.sort((a, b) => {
      // Find the index of the first matching type in include list
      const aIndex = include.findIndex(type => type === '*' || isComponentType(a, type));
      const bIndex = include.findIndex(type => type === '*' || isComponentType(b, type));
      
      // If both match, sort by their position in include list
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      
      // If only one matches, it comes first
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      
      // Neither matches (shouldn't happen), keep original order
      return 0;
    });
  }
  
  return filtered;
}

/**
 * Render a component from workflow history
 * Handles all the boilerplate: props spreading, nodeId, chatId
 * 
 * @example
 * {components.map(c => renderComponent(c))}
 */
export function renderComponent(component: ResponseComponent, additionalProps?: Record<string, any>) {
  const { Component, props, id, nodeId, chatId } = component;
  if (!Component) return null;
  
  return (
    <Component 
      key={id} 
      {...props} 
      nodeId={nodeId} 
      chatId={chatId}
      {...additionalProps}
    />
  );
}
