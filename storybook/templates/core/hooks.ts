/**
 * Core hooks for Gravity Templates
 */

import { useCallback } from "react";
import type { GravityClient, HistoryEntry, UserMessage, AssistantResponse } from "./types";

/**
 * Hook for interacting with the Gravity client
 * Provides common template functionality
 */
export function useGravityClient(client: GravityClient, onStateChange?: (state: any) => void) {
  const sendMessage = useCallback(
    async (message: string) => {
      // Optimistically set streaming state immediately
      onStateChange?.({ isStreaming: true });

      // Add to history and get the entry with generated chatId
      const userEntry = client.history.addUserMessage(message, {
        workflowId: client.session.workflowId,
        targetTriggerNode: client.session.targetTriggerNode,
      });

      // Send to server with the chatId for request-response matching
      client.websocket.sendUserAction("send_message", {
        message,
        chatId: userEntry.chatId,
        workflowId: client.session.workflowId,
        targetTriggerNode: client.session.targetTriggerNode,
      });
    },
    [client, onStateChange]
  );

  return {
    sendMessage,
    history: client.history.entries,
    session: client.session,
  };
}

/**
 * Hook for working with history entries
 * Provides utility methods for filtering and rendering
 */
export function useGravityTemplate(history: HistoryEntry[]) {
  return {
    getUserMessages: () => history.filter((entry): entry is UserMessage => entry.type === "user_message"),
    getResponses: () => history.filter((entry): entry is AssistantResponse => entry.type === "assistant_response"),
    getByRole: (role: "user" | "assistant") => history.filter((entry) => entry.role === role),
    getLatest: () => history[history.length - 1] || null,
    getFirst: () => history[0] || null,
    getAllComponents: () => {
      return history
        .filter((entry): entry is AssistantResponse => entry.type === "assistant_response")
        .flatMap((response) => response.components);
    },
  };
}
