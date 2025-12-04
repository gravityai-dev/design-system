/**
 * SABChatLayout - Clean chat interface with welcome screen
 * Inspired by ADCB's home view with centered window and suggestion cards
 */

import React, { useEffect, useRef, useMemo } from "react";
import { useGravityClient, StreamingState } from "../core";
import ChatInput from "./components/ChatInput";
import { ChatHistory } from "../ChatLayout/components/ChatHistory";
import { WelcomeScreen } from "./components/WelcomeScreen";
import type { SABChatLayoutProps } from "./types";
import styles from "./SABChatLayout.module.css";

// SAB Logo URL
const SAB_LOGO_URL = "https://res.cloudinary.com/sonik/image/upload/v1764865338/SAB/sablogo.jpg";

// Default banking suggestions
const defaultSuggestions = [
  {
    icon: "creditCard",
    title: "Credit Cards",
    question: "What credit cards do you offer?",
  },
  {
    icon: "banknotes",
    title: "Personal Loans",
    question: "Tell me about personal loans",
  },
  {
    icon: "home",
    title: "Home Loans",
    question: "How can I apply for a home loan?",
  },
  {
    icon: "userGroup",
    title: "Account Opening",
    question: "How do I open a bank account?",
  },
];

export default function SABChatLayout(props: SABChatLayoutProps) {
  const {
    client,
    onStateChange,
    placeholder = "Ask me anything...",
    autoScroll = true,
    brandName = "SAB Smart Assistant",
    brandSubtitle = "How can I help you today?",
    logoUrl = SAB_LOGO_URL,
    suggestions = defaultSuggestions,
  } = props;

  // Use universal Gravity client hook
  const { history, sendMessage } = useGravityClient(client, onStateChange);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if any response is currently streaming
  const isStreaming = useMemo(() => {
    return history.some(
      (entry) => entry.type === "assistant_response" && entry.streamingState === StreamingState.STREAMING
    );
  }, [history]);

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
          <ChatInput placeholder={placeholder} onSend={sendMessage} disabled={isStreaming} />
        </div>
      </div>
    </div>
  );
}
