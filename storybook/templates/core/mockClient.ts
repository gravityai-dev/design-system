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
    sendMessage: (message: string, options?: { targetTriggerNode?: string }) => {
      console.log("[Mock] Send message:", message, options);
    },
    emitAction: (type: string, data: any) => {
      console.log("[Mock] Emit action:", type, data);
    },
    sendAgentMessage: (data: {
      content: string;
      chatId: string;
      agentName?: string;
      source?: string;
      props?: Record<string, any>;
      metadata?: Record<string, any>;
    }) => {
      console.log("[Mock] Send agent message:", data);
    },
    history: {
      entries: history,
      getResponses: () => history.filter((e) => e.type === "assistant_response") as AssistantResponse[],
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
  /** Optional metadata (e.g., for Amazon Connect messages) */
  metadata?: Record<string, any>;
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
        metadata: c.metadata,
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
