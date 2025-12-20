/**
 * withFocusMode - HOC that adds universal focus mode to any history renderer
 *
 * IMPORTANT: This HOC does NOT render a separate component instance.
 * It just controls the LAYOUT - the same component renders via renderComponent()
 * with displayState: 'focused' or 'inline' based on focus state.
 *
 * The wrapped component should use renderComponent() which handles displayState.
 *
 * @example
 * // In your template:
 * const FocusableHistory = withFocusMode(MyHistoryRenderer);
 * return <FocusableHistory history={history} client={client} />;
 */

import React, { useMemo } from "react";
import type { GravityClient, ResponseComponent, HistoryEntry, AssistantResponse } from "./types";

// Re-export for convenience
export type { GravityClient, ResponseComponent, HistoryEntry };

interface WithFocusModeProps {
  /** History entries to render */
  history: HistoryEntry[];
  /** Client context with focusState */
  client?: GravityClient;
  /** Any other props passed through to wrapped component */
  [key: string]: any;
}

/**
 * Find a component in history by ID
 */
function findComponentInHistory(history: HistoryEntry[], componentId: string): ResponseComponent | null {
  for (const entry of history) {
    if (entry.type === "assistant_response") {
      const found = (entry as AssistantResponse).components.find((c: ResponseComponent) => c.id === componentId);
      if (found) return found;
    }
  }
  return null;
}

/**
 * HOC that wraps any history renderer with focus mode layout support
 *
 * NOTE: This does NOT render a separate component - it just provides layout.
 * The actual component is rendered by renderComponent() with the correct displayState.
 */
export function withFocusMode<P extends WithFocusModeProps>(WrappedComponent: React.ComponentType<P>): React.FC<P> {
  return function FocusModeWrapper(props: P) {
    const { history, client, ...rest } = props;

    const isFocusOpen = !!client?.focusState?.focusedComponentId;

    // When focused, render with focus layout (full height, close button)
    // The wrapped component still renders - renderComponent() handles displayState
    if (isFocusOpen) {
      return (
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            background: "white",
          }}
        >
          {/* Close button */}
          <button
            onClick={() => client?.closeFocus?.()}
            aria-label="Close focus mode"
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              width: "32px",
              height: "32px",
              borderRadius: "6px",
              border: "none",
              background: "rgba(0, 0, 0, 0.05)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280",
              transition: "background 0.2s, color 0.2s",
              zIndex: 10,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Render wrapped component - it uses renderComponent() which sets displayState */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
            <WrappedComponent {...(props as P)} />
          </div>
        </div>
      );
    }

    // Not focused - render wrapped component normally
    return <WrappedComponent {...(props as P)} />;
  };
}

/**
 * Hook to get focus state and focused component
 * For templates that want more control over focus rendering
 */
export function useFocusedComponent(history: HistoryEntry[], client?: GravityClient) {
  const focusedComponent = useMemo(() => {
    if (!client?.focusState?.focusedComponentId) return null;
    return findComponentInHistory(history, client.focusState.focusedComponentId);
  }, [history, client?.focusState?.focusedComponentId]);

  return {
    isFocusOpen: !!focusedComponent,
    focusedComponent,
    focusState: client?.focusState,
    closeFocus: client?.closeFocus,
  };
}

export default withFocusMode;
