/**
 * CardCarousel Node Definition
 * Auto-generated from Storybook component
 */

import { NodeInputType, type EnhancedNodeDefinition } from "@gravityai-dev/plugin-base";
import CardCarouselExecutor from "./executor";
import { loadDefaultTemplate } from "../service/templates";

export const NODE_TYPE = "CardCarousel";

export function createNodeDefinition(): EnhancedNodeDefinition {
  return {
    packageVersion: "1.0.0",
    type: NODE_TYPE,
    name: "CardCarousel",
    description: "CardCarousel UI component from design system",
    category: "Design System",
    color: "#10b981",
    template: "uiComponent",
    componentTemplate: loadDefaultTemplate(),
    logoUrl: "https://res.cloudinary.com/sonik/image/upload/v1751366180/gravity/icons/gravityIcon.png",
    nodeSize: { width: 900, height: 400 },
    inputs: [{ name: "signal", type: NodeInputType.OBJECT, description: "Signal" }],
    outputs: [{ name: "output", type: NodeInputType.OBJECT, description: "Response object" }],
    configSchema: {
      "type": "object",
      "properties": {
            "title": {
                  "type": "string",
                  "title": "Section title above the carousel",
                  "default": "Recommended Services",
                  "ui:field": "template"
            },
            "items": {
                  "type": "object",
                  "title": "Array of card items to display (from PostgresFetch or similar)",
                  "default": [
                        {
                              "object_type": "service",
                              "id": "1",
                              "title": "SAB Emirates Infinite Credit Card",
                              "description": "Earn Emirates Skywards Miles on your everyday spending and enjoy premium travel and lifestyle privileges.",
                              "image": "https://res.cloudinary.com/sonik/image/upload/v1764906939/bankStock/1248X400-center.jpg",
                              "metadata": {
                                    "callToAction": "Apply Now",
                                    "shortDescription": "Earn Emirates Skywards Miles on your everyday spending and enjoy premium travel and lifestyle privileges."
                              }
                        },
                        {
                              "object_type": "service",
                              "id": "2",
                              "title": "Premium Cashback Card",
                              "description": "Get up to 5% cashback on all your purchases with no annual fee for the first year.",
                              "image": "https://res.cloudinary.com/sonik/image/upload/v1758796390/bankStock/benefits-of-using-credit-card-for-travelling.jpg",
                              "metadata": {
                                    "callToAction": "Get Started",
                                    "shortDescription": "Get up to 5% cashback on all your purchases with no annual fee for the first year."
                              }
                        },
                        {
                              "object_type": "service",
                              "id": "3",
                              "title": "Travel Rewards Plus",
                              "description": "Unlock exclusive travel benefits, airport lounge access, and travel insurance coverage.",
                              "image": "https://res.cloudinary.com/sonik/image/upload/v1758796390/bankStock/what-are-travel-cards-717x404.webp",
                              "metadata": {
                                    "callToAction": "Explore Benefits",
                                    "shortDescription": "Unlock exclusive travel benefits, airport lounge access, and travel insurance coverage."
                              }
                        },
                        {
                              "object_type": "service",
                              "id": "4",
                              "title": "Business Platinum Card",
                              "description": "Designed for business owners with expense management tools and premium rewards.",
                              "image": "https://res.cloudinary.com/sonik/image/upload/v1764906939/bankStock/1248X400-center.jpg",
                              "metadata": {
                                    "callToAction": "Apply for Business",
                                    "shortDescription": "Designed for business owners with expense management tools and premium rewards."
                              }
                        },
                        {
                              "object_type": "service",
                              "id": "5",
                              "title": "Student Starter Card",
                              "description": "Build your credit history with a card designed for students with no credit history required.",
                              "image": "https://res.cloudinary.com/sonik/image/upload/v1758796390/bankStock/benefits-of-using-credit-card-for-travelling.jpg",
                              "metadata": {
                                    "callToAction": "Get Your Card",
                                    "shortDescription": "Build your credit history with a card designed for students with no credit history required."
                              }
                        }
                  ],
                  "ui:field": "template"
            }
      },
      "required": []
},
    credentials: [],
  };
}

const definition = createNodeDefinition();

export const CardCarouselNode = {
  definition,
  executor: CardCarouselExecutor,
};

export { createNodeDefinition as default };
