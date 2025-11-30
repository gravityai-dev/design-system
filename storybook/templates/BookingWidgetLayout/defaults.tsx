/**
 * BookingWidgetLayout Template Defaults
 * Three states: Initial (empty), Streaming (AI working), Complete (finished)
 */

import { StreamingState } from "../GravityTemplate";
import type { UserMessage, AssistantResponse } from "../GravityTemplate";
import BookingWidget from "../../components/BookingWidget/BookingWidget";
import { defaultBookingData } from "../../components/BookingWidget/defaults";

// Use real components
export const MockBookingWidget = BookingWidget;

// ============================================================================
// STATE 1: INITIAL - User just opened the booking page
// ============================================================================

export const mockHistoryInitial: (UserMessage | AssistantResponse)[] = [];

// ============================================================================
// STATE 2: STREAMING - AI is working, components updating
// ============================================================================

export const mockHistoryStreaming: (UserMessage | AssistantResponse)[] = [
  {
    id: "resp-1",
    type: "assistant_response" as const,
    role: "assistant" as const,
    streamingState: StreamingState.STREAMING,
    components: [], // No components yet - shows loading state
    timestamp: new Date().toISOString(),
  },
];

// ============================================================================
// STATE 3: COMPLETE - All components rendered and hydrated
// ============================================================================

export const mockHistoryComplete: (UserMessage | AssistantResponse)[] = [
  {
    id: "resp-1",
    type: "assistant_response" as const,
    role: "assistant" as const,
    streamingState: StreamingState.COMPLETE,
    components: [
      {
        id: "comp-1",
        componentType: "BookingWidget",
        componentUrl: "/components/BookingWidget.js",
        nodeId: "bookingwidget",
        props: { bookingData: defaultBookingData },
        Component: MockBookingWidget,
      },
    ],
    timestamp: new Date().toISOString(),
  },
];

// Mock Gravity client factory
export const createMockClient = (history: (UserMessage | AssistantResponse)[] = []) => ({
  history: {
    entries: history,
    addUserMessage: (message: string, metadata?: any): UserMessage => {
      console.log("[Mock] Add user message:", message, metadata);
      return {
        id: `msg-${Date.now()}`,
        type: "user_message" as const,
        role: "user" as const,
        content: message,
        chatId: `chat-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
    },
    addResponse: (responseData?: any): AssistantResponse => {
      console.log("[Mock] Add response:", responseData);
      return {
        id: `resp-${Date.now()}`,
        type: "assistant_response" as const,
        role: "assistant" as const,
        streamingState: responseData?.streamingState || StreamingState.STREAMING,
        components: responseData?.components || [],
        chatId: responseData?.chatId,
        timestamp: new Date().toISOString(),
      };
    },
    updateResponse: (id: string, updates: any): AssistantResponse | null => {
      console.log("[Mock] Update response:", id, updates);
      return null;
    },
    addComponentToResponse: (
      responseId: string,
      componentData: any,
      loadedComponent?: any
    ): AssistantResponse | null => {
      console.log("[Mock] Add component to response:", responseId, componentData);
      return null;
    },
    getResponses: () => history.filter((e) => e.type === "assistant_response") as AssistantResponse[],
  },
  websocket: {
    sendUserAction: (action: string, data: any) => {
      console.log("[Mock] Send action:", action, data);
    },
  },
  session: {
    conversationId: "story-conv-123",
    chatId: "story-chat-456",
    userId: "story-user-789",
    workflowId: "story-workflow",
    targetTriggerNode: "story-trigger",
  },
});

// ============================================================================
// Mock Clients for Each State
// ============================================================================

export const mockClientInitial = createMockClient(mockHistoryInitial);
export const mockClientStreaming = createMockClient(mockHistoryStreaming);
export const mockClientComplete = createMockClient(mockHistoryComplete);
