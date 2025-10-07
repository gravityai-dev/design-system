/**
 * Card Node Executor
 * Generates ComponentSpec with template and data
 */

import { type ValidationResult, type NodeExecutionContext } from "@gravityai-dev/plugin-base";
import { PromiseNode } from "../../shared/platform";
import { CardConfig, CardOutput } from "../util/types";
import { loadDefaultTemplate } from "../service/templates";

export default class CardExecutor extends PromiseNode<CardConfig> {
  constructor() {
    super("Card");
  }

  protected async validateConfig(config: CardConfig): Promise<ValidationResult> {
    return { success: true };
  }

  protected async executeNode(
    inputs: Record<string, any>,
    config: CardConfig,
    context: NodeExecutionContext
  ): Promise<CardOutput> {
    // Config contains template strings that get rendered with input data
    // e.g., config.title = "{{data.title}}" gets interpolated with inputs.data
    const title = config.title || "";
    const description = config.description || "";
    const imageUrl = config.imageUrl || "";

    // Load default templates from service
    const template = loadDefaultTemplate();

    // Generate ComponentSpec
    const componentSpec = {
      type: "Card",
      version: "1.0.0",
      props: {
        title,
        description,
        imageUrl,
      },
      template: {
        html: template.html,
        css: template.css,
        tokens: template.tokens,
      },
      metadata: {
        dataSource: "direct",
        nodeId: context.nodeId,
        executionId: context.executionId,
      },
    };

    return {
      __outputs: {
        componentSpec,
      },
    };
  }
}
