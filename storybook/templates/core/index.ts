/**
 * Core template library
 * Re-exports everything for easy importing
 */

// Types
export {
  StreamingState,
  type ResponseComponent,
  type UserMessage,
  type AssistantResponse,
  type HistoryEntry,
  type SessionParams,
  type GravityClient,
  type GravityTemplateProps,
} from "./types";

// Hooks
export { useGravityClient, useGravityTemplate } from "./hooks";

// Helpers
export { isComponentType, filterComponents, renderComponent } from "./helpers";

// Mock client (for Storybook)
export { createMockClient, createMockClients, type MockComponent } from "./mockClient";

// Base class
export { GravityTemplate, type GravityTemplateFn } from "./GravityTemplate";
