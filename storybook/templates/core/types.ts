/**
 * Core type definitions for Gravity Templates
 * Single source of truth for all template types
 */

/**
 * Streaming state enum
 */
export enum StreamingState {
  IDLE = "idle",
  STREAMING = "streaming",
  COMPLETE = "complete",
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
  Component?: any;
}

/**
 * User message - simple text message
 */
export interface UserMessage {
  id: string;
  type: "user_message";
  role: "user";
  content: string;
  timestamp: string;
  chatId?: string;
}

/**
 * Assistant response - can contain multiple components
 */
export interface AssistantResponse {
  id: string;
  type: "assistant_response";
  role: "assistant";
  streamingState: StreamingState;
  components: ResponseComponent[];
  timestamp: string;
  chatId?: string;
}

/**
 * History entry - union of user message and assistant response
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
  workflowState?: "WORKFLOW_STARTED" | "WORKFLOW_COMPLETED" | null;
  workflowId?: string | null;
  workflowRunId?: string | null;

  /** Streaming state enum */
  streamingState?: StreamingState;

  /** Template-specific props */
  [key: string]: any;
}
