/**
 * Core helper functions for Gravity Templates
 */

import React from "react";
import type { ResponseComponent } from "./types";

/**
 * Check if component matches a type or category
 * Checks componentType, metadata.category, and nodeId
 */
export function isComponentType(component: ResponseComponent, type: string): boolean {
  const lowerType = type.toLowerCase();

  if (component.componentType?.toLowerCase().includes(lowerType)) {
    return true;
  }

  if (component.metadata?.category?.toLowerCase().includes(lowerType)) {
    return true;
  }

  if (component.nodeId?.toLowerCase().includes(lowerType)) {
    return true;
  }

  return false;
}

/**
 * Filter components by type
 *
 * @example
 * filterComponents(components, { include: ['image'] })
 * filterComponents(components, { exclude: ['image'] })
 * filterComponents(components, { include: ['AIResponse', 'Card', '*'], order: true })
 */
export function filterComponents(
  components: ResponseComponent[],
  options: { include?: string[]; exclude?: string[]; order?: boolean } = {}
): ResponseComponent[] {
  const { include, exclude, order } = options;

  let filtered = components.filter((component) => {
    if (include && include.length > 0) {
      const hasWildcard = include.includes("*");
      if (!hasWildcard) {
        const matches = include.some((type) => isComponentType(component, type));
        if (!matches) return false;
      }
    }

    if (exclude && exclude.length > 0) {
      const matches = exclude.some((type) => isComponentType(component, type));
      if (matches) return false;
    }

    return true;
  });

  if (order && include && include.length > 0) {
    filtered = filtered.sort((a, b) => {
      const aIndex = include.findIndex((type) => type === "*" || isComponentType(a, type));
      const bIndex = include.findIndex((type) => type === "*" || isComponentType(b, type));

      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }

      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;

      return 0;
    });
  }

  return filtered;
}

/**
 * Render a component from workflow history
 * Handles all the boilerplate: props spreading, nodeId, chatId
 */
export function renderComponent(component: ResponseComponent, additionalProps?: Record<string, any>) {
  const { Component, props, id, nodeId, chatId } = component;
  if (!Component) return null;

  return <Component key={id} {...props} nodeId={nodeId} chatId={chatId} {...additionalProps} />;
}
