import type { Meta, StoryObj } from "@storybook/react";
import ChatInput from "./ChatInput";
import { ChatInputDefaults } from "./defaults";

const meta: Meta<typeof ChatInput> = {
  title: "Components/ChatInput",
  component: ChatInput,
  parameters: {
    layout: "centered",
    workflowSize: { width: 500, height: 100 },
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text for the input field",
      workflowInput: true,
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled (e.g., during streaming)",
      workflowInput: true,
    },
    enableAudio: {
      control: "boolean",
      description: "Show microphone button for voice input",
      workflowInput: true,
    },
    isRecording: {
      control: "boolean",
      description: "Whether audio is currently being recorded",
      workflowInput: true,
    },
    onSend: {
      action: "onSend",
      description: "Callback when message is sent",
    },
    onMicrophoneClick: {
      action: "onMicrophoneClick",
      description: "Callback when microphone button is clicked",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "400px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatInput>;

export const Default: Story = {
  args: ChatInputDefaults,
};

export const WithAudio: Story = {
  args: {
    ...ChatInputDefaults,
    enableAudio: true,
  },
};

export const Recording: Story = {
  args: {
    ...ChatInputDefaults,
    enableAudio: true,
    isRecording: true,
  },
};

export const Disabled: Story = {
  args: {
    ...ChatInputDefaults,
    disabled: true,
  },
};

export const CustomPlaceholder: Story = {
  args: {
    ...ChatInputDefaults,
    placeholder: "Type your message here...",
    enableAudio: true,
  },
};
