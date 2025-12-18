import type { Meta, StoryObj } from "@storybook/react";
import CardCarousel from "./CardCarousel";
import { CardCarouselDefaults } from "./defaults";

const meta: Meta<typeof CardCarousel> = {
  title: "Components/CardCarousel",
  component: CardCarousel,
  parameters: {
    layout: "fullscreen",
    workflowSize: { width: 900, height: 400 },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "20px", background: "#f5f5f5" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    // ✅ Workflow inputs - data from AI
    title: {
      control: "text",
      description: "Section title above the carousel",
      workflowInput: true,
    },
    items: {
      control: "object",
      description: "Array of card items to display (from PostgresFetch or similar)",
      workflowInput: true,
    },
    // ❌ Template props - NOT workflow inputs
    onCardClick: {
      action: "cardClicked",
      description: "Callback when a card is clicked",
      workflowInput: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof CardCarousel>;

export const Default: Story = {
  args: CardCarouselDefaults,
};

export const WithoutTitle: Story = {
  args: {
    ...CardCarouselDefaults,
    title: undefined,
  },
};

export const SingleItem: Story = {
  args: {
    title: "Featured Service",
    items: [CardCarouselDefaults.items[0]],
  },
};

export const ManyItems: Story = {
  args: {
    title: "All Services",
    items: [...CardCarouselDefaults.items, ...CardCarouselDefaults.items],
  },
};

export const NoImages: Story = {
  args: {
    title: "Text Only Cards",
    items: CardCarouselDefaults.items.map((item) => ({
      ...item,
      image: undefined,
      metadata: { ...item.metadata, images: undefined },
    })),
  },
};
