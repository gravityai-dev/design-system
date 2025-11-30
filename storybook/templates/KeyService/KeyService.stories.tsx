import type { Meta, StoryObj } from "@storybook/react";
import KeyService from "./KeyService";
import {
  mockClientInitial,
  mockClientStreaming,
  mockClientComplete,
  KeyServiceDefaults,
} from "./defaults.tsx";

const meta: Meta<typeof KeyService> = {
  title: "Templates/KeyService",
  component: KeyService,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', width: '100vw' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    logoUrl: {
      control: "text",
      description: "URL for the logo image",
    },
    logoLink: {
      control: "text",
      description: "Link URL when logo is clicked",
    },
  },
};

export default meta;
type Story = StoryObj<typeof KeyService>;

// Initial - User just opened the page
export const Initial: Story = {
  args: {
    client: mockClientInitial,
    ...KeyServiceDefaults,
  },
};

// Streaming - AI is working, components updating
export const Streaming: Story = {
  args: {
    client: mockClientStreaming,
    ...KeyServiceDefaults,
  },
};

// Complete - All components rendered and hydrated
export const Complete: Story = {
  args: {
    client: mockClientComplete,
    ...KeyServiceDefaults,
  },
};
