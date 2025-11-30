import type { HistoryEntry, GravityClient, SessionParams, UserMessage, AssistantResponse } from "../GravityTemplate";

// Re-export core types
export type { HistoryEntry, GravityClient, SessionParams, UserMessage, AssistantResponse };

/**
 * KeyService Template Props
 * Full-screen split layout with image on right
 */
export interface KeyServiceProps {
  /** Client context with all utilities */
  client: GravityClient;

  /** Callback: Template shares state back to client */
  onStateChange?: (state: any) => void;

  /** Workflow state from Zustand (injected by ComponentRenderer) */
  workflowState?: "WORKFLOW_STARTED" | "WORKFLOW_COMPLETED" | null;
  workflowId?: string | null;
  workflowRunId?: string | null;

  /** Streaming state (auto-derived from workflowState) */
  isStreaming?: boolean;

  /** Optional logo URL */
  logoUrl?: string;

  /** Optional logo link */
  logoLink?: string;
}
