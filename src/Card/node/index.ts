/**
 * Card Node Definition
 * UI Component node that generates a Card ComponentSpec
 */

import { getPlatformDependencies, type EnhancedNodeDefinition } from "@gravityai-dev/plugin-base";
import CardExecutor from "./executor";

export const NODE_TYPE = "Card";

function createNodeDefinition(): EnhancedNodeDefinition {
  const { NodeInputType } = getPlatformDependencies();

  return {
    packageVersion: "1.0.0",
    type: NODE_TYPE,
    name: "Card",
    description: "Card UI component with title, description, and optional image",
    category: "Design System",
    color: "#10b981",
    logoUrl: "https://res.cloudinary.com/sonik/image/upload/v1756968888/gravity/icons/Card.png",
    inputs: [
      {
        name: "data",
        type: NodeInputType.OBJECT,
        description: "Card data (title, description, imageUrl)",
      },
    ],
    outputs: [
      {
        name: "componentSpec",
        type: NodeInputType.OBJECT,
        description: "Component specification for client rendering",
      },
    ],
    configSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          title: "Title",
          description: "Card title text",
          "ui:field": "template",
        },
        description: {
          type: "string",
          title: "Description",
          description: "Card description text",
          "ui:field": "template",
          "ui:widget": "textarea",
        },
        imageUrl: {
          type: "string",
          title: "Image URL",
          description: "URL of the card image (optional)",
          "ui:field": "template",
        },
      },
      required: [],
      "ui:order": ["title", "description", "imageUrl"],
    },
    capabilities: {
      isTrigger: false,
    },
    credentials: [],
  };
}

const definition = createNodeDefinition();

export const CardNode = {
  definition,
  executor: CardExecutor,
};

export { createNodeDefinition };
