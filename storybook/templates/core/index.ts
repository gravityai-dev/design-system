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
  type FocusState,
  type GravityClient,
  type GravityTemplateProps,
} from "./types";

// Hooks
export { useGravityTemplate } from "./hooks";

// Helpers
export { isComponentType, filterComponents, renderComponent } from "./helpers";

// Focus Mode
export { FocusProvider, FocusOverlay, FocusableWrapper, useFocusMode } from "./FocusMode";
export { withFocusMode, useFocusedComponent } from "./withFocusMode";

// Mock client (for Storybook)
export { createMockClient, createMockClients, type MockComponent } from "./mockClient";

// Base class
export { GravityTemplate, type GravityTemplateFn } from "./GravityTemplate";
