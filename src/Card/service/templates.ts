/**
 * Card Template Service
 * Handles loading templates from files (and later from DB)
 */

import { readFileSync } from "fs";
import { join } from "path";
import { CardTemplate } from "../util/types";

/**
 * Load default Card template from files
 * Later: This will fetch from database
 */
export function loadDefaultTemplate(): CardTemplate {
  const html = readFileSync(join(__dirname, "../templates/default.html"), "utf-8");
  const css = readFileSync(join(__dirname, "../templates/default.css"), "utf-8");
  const tokens = JSON.parse(readFileSync(join(__dirname, "../templates/tokens.json"), "utf-8"));

  return {
    html,
    css,
    tokens,
  };
}

/**
 * Load Card template by version
 * Future: Fetch from database by version
 */
export function loadTemplateByVersion(version: string): CardTemplate {
  // For now, always return default
  // Later: SELECT * FROM design_system_components WHERE type='Card' AND version=$1
  return loadDefaultTemplate();
}

/**
 * Load Card template with user customizations
 * Future: Merge with user settings from design_system_settings table
 */
export function loadTemplateForUser(userId: string): CardTemplate {
  // For now, return default
  // Later: JOIN with design_system_settings to get user overrides
  return loadDefaultTemplate();
}
