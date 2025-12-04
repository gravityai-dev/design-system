/**
 * SABChatLayout Template Defaults
 * Following the 3-state pattern: Initial, Streaming, Complete
 */

import { createMockClients } from "../core";
import AIResponse from "../../components/AIResponse/AIResponse";
import Card from "../../components/Card/Card";
import KenBurnsImage from "../../atoms/Image/KenBurnsImage";
import { AIResponseDefaults } from "../../components/AIResponse/defaults";
import { CardDefaults } from "../../components/Card/defaults";
import { KenBurnsImageDefaults } from "../../atoms/Image/defaults";

// Create all 3 states using shared factory
export const {
  mockHistoryInitial,
  mockHistoryStreaming,
  mockHistoryComplete,
  mockClientInitial,
  mockClientStreaming,
  mockClientComplete,
} = createMockClients([
  { componentType: "AIResponse", Component: AIResponse, props: AIResponseDefaults },
  { componentType: "KenBurnsImage", Component: KenBurnsImage, props: KenBurnsImageDefaults },
  { componentType: "Card", Component: Card, props: CardDefaults },
]);

// Template-specific defaults
export const SABChatLayoutDefaults = {
  placeholder: "Ask me anything...",
  autoScroll: true,
  brandName: "SAB Smart Assistant",
  brandSubtitle: "How can I help you today?",
  logoUrl: "https://res.cloudinary.com/sonik/image/upload/v1764865338/SAB/sablogo.jpg",
  suggestions: [
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
  ],
};
