/**
 * ChatInput Node Definition
 * Auto-generated from Storybook component
 */

import { NodeInputType, type EnhancedNodeDefinition } from "@gravityai-dev/plugin-base";
import ChatInputExecutor from "./executor";
import { loadDefaultTemplate } from "../service/templates";

export const NODE_TYPE = "ChatInput";

export function createNodeDefinition(): EnhancedNodeDefinition {
  return {
    packageVersion: "1.0.0",
    type: NODE_TYPE,
    name: "ChatInput",
    description: "ChatInput UI component from design system",
    category: "Design System",
    color: "#10b981",
    template: "uiComponent",
    componentTemplate: loadDefaultTemplate(),
    logoUrl: "https://res.cloudinary.com/sonik/image/upload/v1751366180/gravity/icons/gravityIcon.png",
    nodeSize: { width: 500, height: 100 },
    inputs: [{ name: "signal", type: NodeInputType.OBJECT, description: "Signal" }],
    outputs: [{ name: "output", type: NodeInputType.OBJECT, description: "Response object" }],
    configSchema: {
      "type": "object",
      "properties": {
            "placeholder": {
                  "type": "string",
                  "title": "Placeholder text for the input field",
                  "default": "Ask me anything...",
                  "ui:field": "template"
            },
            "disabled": {
                  "type": "boolean",
                  "title": "Whether the input is disabled (e.g., during streaming)",
                  "default": false,
                  "ui:widget": "toggle"
            },
            "enableAudio": {
                  "type": "boolean",
                  "title": "Show microphone button for voice input",
                  "default": false,
                  "ui:widget": "toggle"
            },
            "isRecording": {
                  "type": "boolean",
                  "title": "Whether audio is currently being recorded",
                  "default": false,
                  "ui:widget": "toggle"
            }
      },
      "required": []
},
    credentials: [],
  };
}

const definition = createNodeDefinition();

export const ChatInputNode = {
  definition,
  executor: ChatInputExecutor,
};

export { createNodeDefinition as default };
