/**
 * Default Design Tokens
 * CSS variables that can be overridden by themes
 */

import { typographyTokens } from './typography';

export const defaultTokens = {
  // Colors
  '--gravity-color-primary': '#10b981',
  '--gravity-color-secondary': '#3b82f6',
  '--gravity-color-text-primary': '#111827',
  '--gravity-color-text-secondary': '#6b7280',
  '--gravity-color-text-tertiary': '#9ca3af',
  '--gravity-color-bg-primary': '#ffffff',
  '--gravity-color-bg-secondary': '#f9fafb',
  '--gravity-color-border': '#e5e7eb',
  
  // Typography (imported from typography.ts)
  ...typographyTokens,
  
  // Spacing
  '--gravity-space-1': '0.25rem',      // 4px
  '--gravity-space-2': '0.5rem',       // 8px
  '--gravity-space-3': '0.75rem',      // 12px
  '--gravity-space-4': '1rem',         // 16px
  '--gravity-space-5': '1.25rem',      // 20px
  '--gravity-space-6': '1.5rem',       // 24px
  '--gravity-space-8': '2rem',         // 32px
  '--gravity-space-10': '2.5rem',      // 40px
  '--gravity-space-12': '3rem',        // 48px
  
  // Border Radius
  '--gravity-radius-sm': '0.25rem',    // 4px
  '--gravity-radius-md': '0.5rem',     // 8px
  '--gravity-radius-lg': '0.75rem',    // 12px
  '--gravity-radius-xl': '1rem',       // 16px
  '--gravity-radius-2xl': '1.5rem',    // 24px
  '--gravity-radius-full': '9999px',
  
  // Shadows
  '--gravity-shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  '--gravity-shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  '--gravity-shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  '--gravity-shadow-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  
  // Component-specific: Card
  '--gravity-card-bg': 'var(--gravity-color-bg-primary)',
  '--gravity-card-border': 'var(--gravity-color-border)',
  '--gravity-card-padding': 'var(--gravity-space-6)',
  '--gravity-card-radius': 'var(--gravity-radius-xl)',
  '--gravity-card-shadow': 'var(--gravity-shadow-sm)',
  '--gravity-card-hover-shadow': 'var(--gravity-shadow-lg)',
  
  // Transitions
  '--gravity-transition-fast': '150ms',
  '--gravity-transition-base': '200ms',
  '--gravity-transition-slow': '300ms',
};

export type DesignTokens = typeof defaultTokens;
