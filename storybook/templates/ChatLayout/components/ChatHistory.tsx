/**
 * ChatHistory - Renders the conversation timeline
 * Chat-specific rendering: user messages on right, assistant responses on left
 */

import React from "react";
import type { HistoryEntry } from "./types";
import { ChatHistoryItem } from "./ChatHistoryItem";
import styles from "./ChatHistory.module.css";

interface ChatHistoryProps {
  history: HistoryEntry[];
  onQuestionClick?: (question: string) => void;
  onComponentAction?: (actionType: string, actionData: any) => void;
}

export function ChatHistory({ history, onQuestionClick, onComponentAction }: ChatHistoryProps) {
  console.log(
    "[ChatHistory] Rendering with entries:",
    history.map((e) => ({
      id: e.id,
      type: e.type,
      chatId: e.chatId,
      componentsCount: e.type === "assistant_response" ? e.components.length : 0,
      streamingState: e.type === "assistant_response" ? e.streamingState : undefined,
    }))
  );

  if (history.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h1 className={styles.emptyTitle}>Gravity AI</h1>
        <p className={styles.emptySubtitle}>How can I help you today?</p>
      </div>
    );
  }

  return (
    <div className={styles.historyContainer}>
      {history.map((entry) => {
        // User message - chat bubble on right
        if (entry.type === "user_message") {
          return (
            <div key={entry.id} className={styles.userMessageContainer}>
              <div className={styles.userMessageBubble}>
                <div className={styles.userMessageText}>{entry.content}</div>
              </div>
            </div>
          );
        }

        // Assistant response - can contain multiple components
        if (entry.type === "assistant_response") {
          return (
            <ChatHistoryItem
              key={entry.id}
              response={entry}
              onQuestionClick={onQuestionClick}
              onComponentAction={onComponentAction}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
