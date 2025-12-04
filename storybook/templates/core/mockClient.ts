/**
 * Mock client factory for Storybook stories
 * Shared across all templates - no more duplication!
 */

import { StreamingState } from "./types";
import type { UserMessage, AssistantResponse, ResponseComponent, GravityClient } from "./types";

/**
 * Create a mock GravityClient for Storybook
 */
export function createMockClient(history: (UserMessage | AssistantResponse)[] = []): GravityClient {
  return {
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
  };
}

/**
 * Component definition for mock history
 */
export interface MockComponent {
  componentType: string;
  Component: any;
  props: Record<string, any>;
  nodeId?: string;
}

/**
 * Create mock clients for all 3 Storybook states
 *
 * @example
 * const { mockClientInitial, mockClientStreaming, mockClientComplete } = createMockClients([
 *   { componentType: "AIResponse", Component: AIResponse, props: AIResponseDefaults },
 *   { componentType: "Card", Component: Card, props: CardDefaults },
 * ]);
 */
export function createMockClients(completeComponents: MockComponent[]) {
  // STATE 1: INITIAL - Empty
  const mockHistoryInitial: (UserMessage | AssistantResponse)[] = [];

  // STATE 2: STREAMING - Workflow running, no components yet
  const mockHistoryStreaming: (UserMessage | AssistantResponse)[] = [
    {
      id: "resp-1",
      type: "assistant_response" as const,
      role: "assistant" as const,
      streamingState: StreamingState.STREAMING,
      components: [],
      timestamp: new Date().toISOString(),
    },
  ];

  // STATE 3: COMPLETE - All components rendered
  const mockHistoryComplete: (UserMessage | AssistantResponse)[] = [
    {
      id: "resp-1",
      type: "assistant_response" as const,
      role: "assistant" as const,
      streamingState: StreamingState.COMPLETE,
      components: completeComponents.map((c, i) => ({
        id: `comp-${i + 1}`,
        componentType: c.componentType,
        nodeId: c.nodeId || c.componentType.toLowerCase(),
        props: c.props,
        Component: c.Component,
      })),
      timestamp: new Date().toISOString(),
    },
  ];

  return {
    mockHistoryInitial,
    mockHistoryStreaming,
    mockHistoryComplete,
    mockClientInitial: createMockClient(mockHistoryInitial),
    mockClientStreaming: createMockClient(mockHistoryStreaming),
    mockClientComplete: createMockClient(mockHistoryComplete),
  };
}
