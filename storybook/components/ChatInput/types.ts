/**
 * ChatInput Types
 */

// FAQ can be a string or an object with question property
export type FAQ = string | { id?: string; question: string };

export interface Action {
  id?: string;
  label?: string;
  title?: string;
  description?: string;
  image?: string;
  callToAction?: string;
  icon?: string;
  object?: Record<string, any>;
}

export interface Recommendation {
  id: string;
  text: string;
  confidence?: number;
  actionLabel?: string;
}

export interface ChatInputProps {
  placeholder?: string;
  onSend?: (message: string) => void;
  disabled?: boolean;
  enableAudio?: boolean;
  isRecording?: boolean;
  onMicrophoneClick?: () => void;
  faqs?: FAQ[];
  actions?: Action[];
  recommendations?: Recommendation[];
  onFaqClick?: (faq: string) => void;
  onActionClick?: (data: any) => void;
  onRecommendationClick?: (recommendation: Recommendation) => void;
}

export type TabType = "actions" | "recommendations" | "faq" | null;
