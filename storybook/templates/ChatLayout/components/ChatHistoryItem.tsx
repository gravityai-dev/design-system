/**
 * ChatHistoryItem - Renders an assistant response with multiple components
 * Each response has its own streaming state that is passed to all child components
 */

import React from "react";
import type { AssistantResponse } from "../types";
import { AssistantAvatar } from "./AssistantAvatar";
import styles from "./ChatHistoryItem.module.css";

interface ChatHistoryItemProps {
  response: AssistantResponse;
  onQuestionClick?: (question: string) => void;
}

/**
 * ChatHistoryItem - Container for assistant responses
 *
 * Features:
 * - Manages streaming state for the entire response
 * - Can contain multiple components
 * - Passes streaming state to all child components
 * - Shows avatar with animation based on streaming state
 */
export function ChatHistoryItem({ response, onQuestionClick }: ChatHistoryItemProps) {
  const { streamingState, components, timestamp } = response;

  // Show animation whenever workflow is streaming/running
  // This is independent of whether components have arrived yet
  const showAnimation = streamingState === "streaming";

  // Don't render anything if complete with no components (shouldn't happen, but handle gracefully)
  if (streamingState === "complete" && components.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* Avatar - always visible when we render */}
      <AssistantAvatar showAnimation={showAnimation} />

      {/* Components container - always present to maintain layout */}
      <div className={styles.componentsContainer}>
        {components.length > 0 ? (
          <>
            {components.map((component) => {
              const { Component, props, id, nodeId, chatId } = component;

              if (!Component) {
                return null;
              }

              return (
                <div key={id}>
                  <Component
                    {...props}
                    nodeId={nodeId}
                    chatId={chatId}
                    streamingState={streamingState}
                    onQuestionClick={onQuestionClick}
                  />
                </div>
              );
            })}

            {/* Timestamp */}
            {timestamp && <span className={styles.timestamp}>{formatRelativeTime(timestamp)}</span>}
          </>
        ) : (
          // Show loading state when streaming but no components yet
          streamingState === "streaming" && <div className={styles.loadingState}>Thinking...</div>
        )}
      </div>
    </div>
  );
}

// Format relative time
function formatRelativeTime(date: string): string {
  const now = new Date();
  const messageDate = new Date(date);
  const diffMs = now.getTime() - messageDate.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hr ago`;
  if (messageDate.toDateString() === now.toDateString()) {
    return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return messageDate.toLocaleDateString();
}
