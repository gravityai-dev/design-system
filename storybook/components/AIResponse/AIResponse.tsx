import React, { useState, useEffect, useRef } from "react";
import Markdown from "markdown-to-jsx";
import { ChunkAnimator } from "./chunkAnimator";
import styles from "./AIResponse.module.css";

interface AIResponseProps {
  progressText?: string;
  text?: string;
  questions?: string[]; // Always an array of strings
  onQuestionClick?: (question: string) => void;
  className?: string;
  nodeId?: string; // For Zustand store subscription
  isStreaming?: boolean; // Show typing cursor when streaming
}

export default function AIResponse(props: AIResponseProps) {
  const { progressText, text, questions, onQuestionClick, className, isStreaming } = props;

  const [displayedText, setDisplayedText] = useState("");
  const animatorRef = useRef<ChunkAnimator | null>(null);
  const lastTextRef = useRef<string>("");

  // Initialize animator once
  if (!animatorRef.current) {
    animatorRef.current = new ChunkAnimator({
      charsPerSecond: 300,
      onUpdate: setDisplayedText,
      onTypingChange: () => {}, // Not used - we use isStreaming prop instead
    });
  }

  // Pass accumulated text to animator - only when it changes
  useEffect(() => {
    if (text && text !== lastTextRef.current) {
      animatorRef.current?.addChunk(text);
      lastTextRef.current = text;
    }
  }, [text]);

  // Questions are always an array of strings
  const questionList = questions || [];

  return (
    <div className={`${styles.container} ${className || ""}`}>
      {/* Reasoning/Thinking - rendered as markdown in italic gray */}
      {progressText && (
        <div className={styles.progress}>
          <Markdown>{progressText}</Markdown>
        </div>
      )}

      {/* Text - server sends accumulated chunks */}
      {displayedText && (
        <div className={`${styles.textContent} prose`}>
          <Markdown>{displayedText}</Markdown>
          {/* Animated blinking cursor inline with text */}
          {isStreaming && <span className={styles.cursor} />}
        </div>
      )}

      {/* Questions - only show if questions are provided */}
      {questionList.length > 0 && (
        <div className={styles.questionsContainer}>
          {questionList.map((question, i) => (
            <button key={`q-${i}`} className={styles.questionButton} onClick={() => onQuestionClick?.(question)}>
              <svg className={styles.questionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              <span className={styles.questionText}>{question}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
