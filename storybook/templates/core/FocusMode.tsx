/**
 * Focus Mode - Universal component focus system
 *
 * Allows ANY component to expand and become the primary interaction surface.
 * Components don't need to know about Focus Mode - it's handled at the template level.
 *
 * Usage:
 * 1. Wrap template with FocusProvider
 * 2. Use renderComponent() - it auto-wraps focusable components
 * 3. Add FocusOverlay to render focused component
 */

import React, { createContext, useContext, useState, useCallback } from "react";
import type { ResponseComponent } from "./types";

// ============================================================
// FOCUS STATE CONTEXT
// ============================================================

interface FocusState {
  /** Currently focused component ID */
  focusedComponentId: string | null;
  /** Is focus mode open */
  isFocusOpen: boolean;
  /** Target trigger for routing messages when focused */
  targetTriggerNode: string | null;
  /** Chat ID to use when focused (same chatId = update existing component) */
  chatId: string | null;
  /** The focused component data */
  focusedComponent: ResponseComponent | null;
}

interface FocusActions {
  /** Open focus mode for a component */
  openFocus: (component: ResponseComponent) => void;
  /** Close focus mode */
  closeFocus: () => void;
}

type FocusContextValue = FocusState & FocusActions;

const FocusContext = createContext<FocusContextValue | null>(null);

/**
 * Hook to access focus state and actions
 */
export function useFocusMode(): FocusContextValue {
  const context = useContext(FocusContext);
  if (!context) {
    // Return a no-op version if not wrapped in provider
    return {
      focusedComponentId: null,
      isFocusOpen: false,
      targetTriggerNode: null,
      chatId: null,
      focusedComponent: null,
      openFocus: () => {},
      closeFocus: () => {},
    };
  }
  return context;
}

// ============================================================
// FOCUS PROVIDER
// ============================================================

interface FocusProviderProps {
  children: React.ReactNode;
  /** Callback when focus state changes (for template to adjust message routing) */
  onFocusChange?: (state: FocusState) => void;
}

/**
 * FocusProvider - Wrap your template to enable Focus Mode
 *
 * @example
 * <FocusProvider onFocusChange={(state) => setMessageRouting(state)}>
 *   <YourTemplate />
 * </FocusProvider>
 */
export function FocusProvider({ children, onFocusChange }: FocusProviderProps) {
  const [state, setState] = useState<FocusState>({
    focusedComponentId: null,
    isFocusOpen: false,
    targetTriggerNode: null,
    chatId: null,
    focusedComponent: null,
  });

  const openFocus = useCallback(
    (component: ResponseComponent) => {
      const targetTriggerNode = component.metadata?.targetTriggerNode || null;
      const chatId = component.chatId || null;

      const newState: FocusState = {
        focusedComponentId: component.id,
        isFocusOpen: true,
        targetTriggerNode,
        chatId,
        focusedComponent: component,
      };

      setState(newState);
      onFocusChange?.(newState);
    },
    [onFocusChange]
  );

  const closeFocus = useCallback(() => {
    const newState: FocusState = {
      focusedComponentId: null,
      isFocusOpen: false,
      targetTriggerNode: null,
      chatId: null,
      focusedComponent: null,
    };

    setState(newState);
    onFocusChange?.(newState);
  }, [onFocusChange]);

  const value: FocusContextValue = {
    ...state,
    openFocus,
    closeFocus,
  };

  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
}

// ============================================================
// FOCUSABLE WRAPPER
// ============================================================

interface FocusableWrapperProps {
  /** The component data */
  component: ResponseComponent;
  /** The rendered component element */
  children: React.ReactNode;
  /** Callback to open focus mode (from client.openFocus) */
  onOpenFocus?: (componentId: string, targetTriggerNode: string | null, chatId: string | null) => void;
}

/**
 * FocusableWrapper - Wraps a component to make it focusable
 *
 * Automatically adds expand icon if component has focusable: true in props.
 * Uses client.openFocus callback for universal focus mode across all templates.
 */
export function FocusableWrapper({ component, children, onOpenFocus }: FocusableWrapperProps) {
  // Only focusable if component has focusable: true in props
  const isFocusable = component.props?.focusable === true;

  if (!isFocusable || !onOpenFocus) {
    // Not focusable or no callback - render as-is
    return <>{children}</>;
  }

  const handleOpenFocus = () => {
    const targetTriggerNode = component.metadata?.targetTriggerNode || null;
    const chatId = component.chatId || null;
    onOpenFocus(component.id, targetTriggerNode, chatId);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {children}
      {/* Expand button - overlays on top right of the component */}
      <button
        onClick={handleOpenFocus}
        aria-label="Expand component"
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          width: "32px",
          height: "32px",
          borderRadius: "8px",
          border: "none",
          background: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#374151",
          transition: "all 0.2s ease",
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#ffffff";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {/* Expand icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      </button>
    </div>
  );
}

// ============================================================
// FOCUS OVERLAY
// ============================================================

interface FocusOverlayProps {
  /** Additional props to pass to the focused component */
  additionalProps?: Record<string, any>;
}

/**
 * FocusOverlay - Renders the focused component expanded in the chat area
 *
 * This fills the available space in the chat history area (between header and input).
 * Place this inside the ChatHistory component or similar scrollable area.
 */
export function FocusOverlay({ additionalProps }: FocusOverlayProps) {
  const { isFocusOpen, focusedComponent, closeFocus } = useFocusMode();

  if (!isFocusOpen || !focusedComponent) {
    return null;
  }

  const { Component, props, nodeId, chatId } = focusedComponent;

  if (!Component) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        background: "white",
        animation: "focusFadeIn 0.2s ease-out",
      }}
    >
      {/* Close button - positioned in top right */}
      <button
        onClick={closeFocus}
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
          zIndex: 51,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)";
          e.currentTarget.style.color = "#1f2937";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(0, 0, 0, 0.05)";
          e.currentTarget.style.color = "#6b7280";
        }}
      >
        {/* Close icon (✕) */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Component container - fills available space without scrolling */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
        <Component {...props} nodeId={nodeId} chatId={chatId} {...additionalProps} />
      </div>
    </div>
  );
}
