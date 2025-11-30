/**
 * ChatLayout Template Defaults
 * Three states: Initial (empty), Streaming (AI working), Complete (finished)
 */

import { StreamingState } from "../GravityTemplate";
import type { UserMessage, AssistantResponse } from "./types";
import AIResponse from "../../components/AIResponse/AIResponse";
import Card from "../../components/Card/Card";
import KenBurnsImage from "../../atoms/Image/KenBurnsImage";
import { AIResponseDefaults } from "../../components/AIResponse/defaults";
import { CardDefaults } from "../../components/Card/defaults";
import { KenBurnsImageDefaults } from "../../atoms/Image/defaults";

// Use real components
export const MockAIResponse = AIResponse;
export const MockCard = Card;
export const MockKenBurnsImage = KenBurnsImage;

// ============================================================================
// STATE 1: INITIAL - User just opened the chat
// ============================================================================

export const mockHistoryInitial: (UserMessage | AssistantResponse)[] = [];

// ============================================================================
// STATE 2: STREAMING - AI is working, components updating
// ============================================================================

export const mockHistoryStreaming: (UserMessage | AssistantResponse)[] = [
  {
    id: "msg-1",
    type: "user_message" as const,
    role: "user" as const,
    content: "Tell me about Jedi training",
    timestamp: new Date().toISOString(),
  },
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
    id: "msg-1",
    type: "user_message" as const,
    role: "user" as const,
    content: "Tell me about Jedi training",
    timestamp: new Date().toISOString(),
  },
  {
    id: "resp-1",
    type: "assistant_response" as const,
    role: "assistant" as const,
    streamingState: StreamingState.COMPLETE,
    components: [
      {
        id: "comp-1",
        componentType: "AIResponse",
        componentUrl: "/components/AIResponse.js",
        props: AIResponseDefaults,
        Component: MockAIResponse,
      },
      {
        id: "comp-2",
        componentType: "KenBurnsImage",
        componentUrl: "/components/KenBurnsImage.js",
        props: KenBurnsImageDefaults,
        Component: MockKenBurnsImage,
      },
      {
        id: "comp-3",
        componentType: "Card",
        componentUrl: "/components/Card.js",
        props: CardDefaults,
        Component: MockCard,
      },
    ],
    timestamp: new Date().toISOString(),
  },
];

// Mock Gravity client factory
export const createMockClient = (history: (UserMessage | AssistantResponse)[] = [], conversationState: any = {}) => ({
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
    // Backward compatibility
    addComponent: (componentData: any, loadedComponent: any): AssistantResponse => {
      console.log("[Mock] Add component (deprecated):", componentData);
      // For mock purposes, create a response with single component
      return {
        id: `resp-${Date.now()}`,
        type: "assistant_response" as const,
        role: "assistant" as const,
        streamingState: StreamingState.COMPLETE,
        components: [
          {
            id: `comp-${Date.now()}`,
            ...componentData,
            Component: loadedComponent,
          },
        ],
        timestamp: new Date().toISOString(),
      };
    },
    updateEntry: (id: string, updates: any) => {
      console.log("[Mock] Update entry:", id, updates);
      return null;
    },
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
  // Add conversation state for sidebar stories
  conversationState,
});

// ============================================================================
// Mock Clients for Each State
// ============================================================================

export const mockClientInitial = createMockClient(mockHistoryInitial);
export const mockClientStreaming = createMockClient(mockHistoryStreaming);
export const mockClientComplete = createMockClient(mockHistoryComplete);

// Default props for ChatLayout
export const ChatLayoutDefaults = {
  placeholder: "Ask me anything...",
  autoScroll: true,
};
