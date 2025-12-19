/**
 * SABChatLayout - Clean chat interface with welcome screen
 * Inspired by ADCB's home view with centered window and suggestion cards
 */

import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { StreamingState } from "../core";
import ChatInput from "../../components/ChatInput";
import { ChatHistory } from "../ChatLayout/components/ChatHistory";
import { WelcomeScreen } from "./components/WelcomeScreen";
import type { SABChatLayoutProps } from "./types";
import styles from "./SABChatLayout.module.css";
import { SABChatLayoutDefaults } from "./defaults";

export default function SABChatLayout(props: SABChatLayoutProps) {
  const {
    client,
    onStateChange,
    placeholder = SABChatLayoutDefaults.placeholder,
    autoScroll = SABChatLayoutDefaults.autoScroll,
    brandName = SABChatLayoutDefaults.brandName,
    brandSubtitle = SABChatLayoutDefaults.brandSubtitle,
    logoUrl = SABChatLayoutDefaults.logoUrl,
    suggestions = SABChatLayoutDefaults.suggestions,
  } = props;

  // Access history and sendMessage directly from client
  const history = client.history.entries;

  // Wrap sendMessage to also trigger streaming state
  const sendMessage = useCallback(
    (message: string) => {
      onStateChange?.({ isStreaming: true });
      client.sendMessage(message);
    },
    [client, onStateChange]
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if any response is currently streaming
  const isStreaming = useMemo(() => {
    return history.some(
      (entry) => entry.type === "assistant_response" && entry.streamingState === StreamingState.STREAMING
    );
  }, [history]);

  // Get suggestions from client state (populated via SUGGESTIONS_UPDATE WebSocket event)
  const { faqs, actions, recommendations } = useMemo(() => {
    const suggestions = client.suggestions || {};
    console.log("[SABChatLayout] client.suggestions:", suggestions);
    return {
      faqs: suggestions.faqs || [],
      actions: suggestions.actions || [],
      recommendations: suggestions.recommendations || [],
    };
  }, [client.suggestions]);

  // Determine if we should show welcome screen (no messages yet)
  const showWelcome = history.length === 0;

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (autoScroll && messagesEndRef.current && !showWelcome) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, autoScroll, showWelcome]);

  // Auto-scroll when content updates (streaming)
  useEffect(() => {
    if (!autoScroll || !containerRef.current || showWelcome) return;

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
  }, [autoScroll, showWelcome]);

  return (
    <div className={styles.container}>
      <div className={styles.chatWindow}>
        {/* Header with SAB logo */}
        <div className={styles.header}>
          <div className={styles.headerBrand}>
            {logoUrl && <img src={logoUrl} alt={brandName} className={styles.headerLogo} />}
          </div>
        </div>

        {/* Messages area */}
        <div ref={containerRef} className={styles.messagesArea}>
          <div className={styles.messagesContent}>
            {showWelcome ? (
              <WelcomeScreen
                brandName={brandName}
                brandSubtitle={brandSubtitle}
                logoUrl={logoUrl}
                suggestions={suggestions}
                onQuestionClick={sendMessage}
              />
            ) : (
              <div className={styles.messagesInner}>
                <ChatHistory history={history} onQuestionClick={sendMessage} />
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input area */}
        <div className={styles.inputArea}>
          <ChatInput
            placeholder={placeholder}
            onSend={sendMessage}
            disabled={isStreaming}
            enableAudio={true}
            faqs={faqs}
            actions={actions}
            recommendations={recommendations}
          />
        </div>
      </div>
    </div>
  );
}
