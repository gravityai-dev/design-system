import React, { useEffect, useRef, useMemo } from "react";
import { useGravityClient, StreamingState } from "../core";
import ChatInput from "./components/ChatInput";
import { ChatHistory } from "./components/ChatHistory";
import type { ChatLayoutCompactProps } from "./types";
import styles from "./ChatLayoutCompact.module.css";

/**
 * ChatLayoutCompact - A more compact, modern chat interface
 *
 * Differences from ChatLayout:
 * - Tighter spacing and smaller fonts
 * - Rounded corners and subtle shadows
 * - Blue accent color instead of default
 * - Narrower max width for better readability
 */
export default function ChatLayoutCompact(props: ChatLayoutCompactProps) {
  const { client, onStateChange, placeholder = "Type your message...", autoScroll = true } = props;

  // Use universal Gravity client hook (handles sending, history)
  const { history, sendMessage } = useGravityClient(client, onStateChange);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if any response is currently streaming
  const isStreaming = useMemo(() => {
    return history.some(
      (entry) => entry.type === "assistant_response" && entry.streamingState === StreamingState.STREAMING
    );
  }, [history]);

  // Auto-scroll to bottom when history changes (new messages)
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, autoScroll]);

  // Auto-scroll when content updates (streaming text via Zustand)
  useEffect(() => {
    if (!autoScroll || !containerRef.current) return;

    const observer = new MutationObserver(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    });

    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [autoScroll]);

  return (
    <div className={styles.container}>
      {/* Header Badge */}
      <div className={styles.header}>
        <div className={styles.badge}>💬 Compact Chat</div>
      </div>

      {/* Messages Container - Scrollable with padding for fixed input */}
      <div ref={containerRef} className={styles.messagesContainer}>
        <div className={styles.messagesInner}>
          <ChatHistory history={history} onQuestionClick={sendMessage} />
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className={styles.inputArea}>
        <div className={styles.inputInner}>
          <ChatInput placeholder={placeholder} onSend={sendMessage} disabled={isStreaming} />
        </div>
      </div>
    </div>
  );
}
