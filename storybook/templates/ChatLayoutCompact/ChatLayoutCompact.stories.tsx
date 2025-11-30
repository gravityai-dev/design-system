import type { Meta, StoryObj } from "@storybook/react";
import ChatLayoutCompact from "./ChatLayoutCompact";
import { mockClientInitial, mockClientStreaming, mockClientComplete, ChatLayoutDefaults } from "./defaults.tsx";

const meta: Meta<typeof ChatLayoutCompact> = {
  title: "Templates/ChatLayoutCompact",
  component: ChatLayoutCompact,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ height: "100vh", width: "100vw" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text for input",
    },
    autoScroll: {
      control: "boolean",
      description: "Auto-scroll to bottom on new content",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChatLayoutCompact>;

// Initial - User just opened the chat
export const Initial: Story = {
  args: {
    client: mockClientInitial,
    ...ChatLayoutDefaults,
    placeholder: "Type your message...",
  },
};

// Streaming - AI is working, components updating
export const Streaming: Story = {
  args: {
    client: mockClientStreaming,
    ...ChatLayoutDefaults,
    placeholder: "Type your message...",
  },
};

// Complete - All components rendered and hydrated
export const Complete: Story = {
  args: {
    client: mockClientComplete,
    ...ChatLayoutDefaults,
    placeholder: "Type your message...",
  },
};
