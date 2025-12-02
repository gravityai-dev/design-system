/**
 * Type definitions for ChatLayout
 *
 * Re-exports from GravityTemplate.tsx (single source of truth)
 * All templates use the same universal types
 */

import type {
  SessionParams,
  GravityClient,
  StreamingState,
  HistoryEntry,
  UserMessage,
  AssistantResponse,
  ResponseComponent,
} from "../GravityTemplate";

// Re-export all core types from GravityTemplate
export type {
  SessionParams,
  GravityClient,
  StreamingState,
  HistoryEntry,
  UserMessage,
  AssistantResponse,
  ResponseComponent,
};

/**
 * ChatLayout-specific props
 */
export interface ChatLayoutProps {
  /** Client context with all utilities - properly typed! */
  client: GravityClient;
  /** Callback: Template shares state back to client */
  onStateChange?: (state: { streamingState?: StreamingState; [key: string]: any }) => void;
  /** Streaming state enum */
  streamingState?: StreamingState;
  /** Placeholder text for input */
  placeholder?: string;
  /** Auto-scroll to bottom */
  autoScroll?: boolean;
}
