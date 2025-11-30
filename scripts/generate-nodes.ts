#!/usr/bin/env ts-node
/// <reference types="node" />
/**
 * Generate workflow nodes from Storybook components
 *
 * Usage: npm run generate-nodes
 *
 * This script:
 * 1. Scans src/components/ for Storybook components
 * 2. Extracts argTypes from .stories.tsx files
 * 3. Renders React components to HTML templates
 * 4. Generates complete Promise Node structure
 * 5. Writes actual TypeScript files you can inspect
 */

import * as path from "path";
import * as fs from "fs";
import chalk from "chalk";
import { ComponentScanner } from "./ingestion/ComponentScanner";
import { FileGenerator } from "./ingestion/FileGenerator";

async function main() {
  console.log(chalk.bold.cyan("\n🎨 Generating workflow nodes and templates from Storybook...\n"));

  try {
    // Get package root directory
    const packageRoot = process.cwd();

    // Get components directory from storybook folder
    const componentsDir = path.join(packageRoot, "storybook/components");
    const templatesDir = path.join(packageRoot, "storybook/templates");
    // Output to src folder (where gravity plugin pulls from)
    const outputDir = path.join(packageRoot, "src");

    // Scan for components (workflow nodes)
    console.log(chalk.blue("\\n📦 COMPONENTS (Workflow Nodes)"));
    console.log(chalk.gray("   Scanning: " + componentsDir));
    const componentScanner = new ComponentScanner(componentsDir);
    const components = await componentScanner.scan();
    console.log(chalk.green("   ✓ Found " + components.length + " components"));
    components.forEach(c => console.log(chalk.gray("      - " + c.name)));
    console.log("");

    // Scan for templates (bundle only, no workflow nodes)
    console.log(chalk.magenta("\n🎭 TEMPLATES (Layout Containers)"));
    console.log(chalk.gray("   Scanning: " + templatesDir));
    const templateScanner = new ComponentScanner(templatesDir);
    const templates = await templateScanner.scan();
    console.log(chalk.green("   ✓ Found " + templates.length + " templates\n"));

    if (components.length === 0 && templates.length === 0) {
      console.log("⚠️  No components or templates found.");
      process.exit(0);
    }

    // Generate files for each component (full workflow node)
    const generator = new FileGenerator(outputDir);
    let generated = 0;

    console.log(chalk.bold.blue("\\n━━━ Generating Workflow Nodes ━━━\\n"));
    for (const component of components) {
      try {
        console.log(chalk.cyan("   → " + component.name));
        await generator.generate(component);
        generated++;
        console.log(chalk.green("     ✓ Generated: src/" + component.name + "/\\n"));
      } catch (error) {
        console.error(chalk.red("     ✗ Failed: " + component.name), error);
      }
    }

    // Generate bundles for templates (no workflow nodes)
    console.log(chalk.bold.magenta("\\n━━━ Bundling Templates ━━━\\n"));
    for (const template of templates) {
      try {
        console.log(chalk.magenta("   → " + template.name));
        await generator.generateTemplateOnly(template);
        generated++;
        console.log(chalk.green("     ✓ Bundled: dist/components/" + template.name + ".js\\n"));
      } catch (error) {
        console.error(chalk.red("     ✗ Failed: " + template.name), error);
      }
    }

    console.log(chalk.bold.green("\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    console.log(chalk.bold.green("✓ Successfully generated " + generated + "/" + (components.length + templates.length) + " items"));
    console.log(chalk.blue("  • " + components.length + " workflow nodes"));
    console.log(chalk.magenta("  • " + templates.length + " templates"));
    console.log(chalk.bold.green("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n"));
    console.log(chalk.yellow("📋 Next steps:"));
    console.log(chalk.gray("   1. Review generated files in src/[ComponentName]/"));
    console.log(chalk.gray("   2. Test the components"));
    console.log(chalk.gray("   3. Commit to git"));
    console.log(chalk.gray("   4. Restart server to load new nodes\n"));
  } catch (error) {
    console.error("❌ Generation failed:", error);
    process.exit(1);
  }
}

main();
