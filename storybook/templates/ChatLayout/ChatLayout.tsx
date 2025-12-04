import React, { useEffect, useRef, useMemo } from "react";
import { useGravityClient, StreamingState } from "../core";
import ChatInput from "./components/ChatInput";
import { ChatHistory } from "./components/ChatHistory";
import type { ChatLayoutProps } from "./types";
import styles from "./ChatLayout.module.css";

export default function ChatLayout(props: ChatLayoutProps) {
  const { client, onStateChange, placeholder = "Ask me anything...", autoScroll = true } = props;

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
