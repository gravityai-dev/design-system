/**
 * Typography System
 * Clear, scalable typography rules based on Apple's design principles
 */

export const typographyTokens = {
  // Font Families
  '--gravity-font-heading': 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
  '--gravity-font-body': 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
  '--gravity-font-mono': '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',

  // Font Weights
  '--gravity-font-weight-light': '300',
  '--gravity-font-weight-normal': '400',
  '--gravity-font-weight-medium': '500',
  '--gravity-font-weight-semibold': '600',
  '--gravity-font-weight-bold': '700',

  // Display (Hero Headlines)
  '--gravity-text-display-1': '72px',      // 4.5rem - Massive hero
  '--gravity-text-display-2': '64px',      // 4rem - Large hero
  '--gravity-text-display-3': '56px',      // 3.5rem - Hero

  // Headings
  '--gravity-text-h1': '48px',             // 3rem - Page title
  '--gravity-text-h2': '40px',             // 2.5rem - Section title
  '--gravity-text-h3': '32px',             // 2rem - Subsection
  '--gravity-text-h4': '24px',             // 1.5rem - Card title
  '--gravity-text-h5': '20px',             // 1.25rem - Small heading
  '--gravity-text-h6': '18px',             // 1.125rem - Tiny heading

  // Body Text
  '--gravity-text-body-xl': '20px',        // 1.25rem - Large body
  '--gravity-text-body-lg': '18px',        // 1.125rem - Medium body
  '--gravity-text-body': '16px',           // 1rem - Default body
  '--gravity-text-body-sm': '14px',        // 0.875rem - Small body
  '--gravity-text-body-xs': '12px',        // 0.75rem - Tiny body

  // Line Heights (Unitless for scalability)
  '--gravity-line-height-tight': '1.1',    // Display text
  '--gravity-line-height-snug': '1.25',    // Headings
  '--gravity-line-height-normal': '1.5',   // Body text
  '--gravity-line-height-relaxed': '1.75', // Long-form content
  '--gravity-line-height-loose': '2',      // Spacious content

  // Letter Spacing
  '--gravity-letter-spacing-tighter': '-0.05em',
  '--gravity-letter-spacing-tight': '-0.025em',
  '--gravity-letter-spacing-normal': '0',
  '--gravity-letter-spacing-wide': '0.025em',
  '--gravity-letter-spacing-wider': '0.05em',
  '--gravity-letter-spacing-widest': '0.1em',
};

/**
 * Typography Scale Rules
 * 
 * Display (Hero):
 * - Font: Heading font
 * - Weight: Semibold (600) or Bold (700)
 * - Line Height: Tight (1.1)
 * - Letter Spacing: Tighter (-0.05em to -0.025em)
 * - Use: Landing pages, hero sections
 * 
 * Headings (H1-H6):
 * - Font: Heading font
 * - Weight: Semibold (600)
 * - Line Height: Snug (1.25)
 * - Letter Spacing: Tight (-0.025em) to Normal (0)
 * - Use: Page structure, content hierarchy
 * 
 * Body Text:
 * - Font: Body font
 * - Weight: Normal (400)
 * - Line Height: Normal (1.5) to Relaxed (1.75)
 * - Letter Spacing: Normal (0)
 * - Use: Paragraphs, descriptions, content
 * 
 * Small Text:
 * - Font: Body font
 * - Weight: Normal (400) or Medium (500)
 * - Line Height: Normal (1.5)
 * - Letter Spacing: Normal (0) to Wide (0.025em)
 * - Use: Captions, labels, metadata
 */

export const typographyRules = {
  display1: {
    fontSize: 'var(--gravity-text-display-1)',
    fontFamily: 'var(--gravity-font-heading)',
    fontWeight: 'var(--gravity-font-weight-bold)',
    lineHeight: 'var(--gravity-line-height-tight)',
    letterSpacing: 'var(--gravity-letter-spacing-tighter)',
  },
  display2: {
    fontSize: 'var(--gravity-text-display-2)',
    fontFamily: 'var(--gravity-font-heading)',
    fontWeight: 'var(--gravity-font-weight-semibold)',
    lineHeight: 'var(--gravity-line-height-tight)',
    letterSpacing: 'var(--gravity-letter-spacing-tight)',
  },
  display3: {
    fontSize: 'var(--gravity-text-display-3)',
    fontFamily: 'var(--gravity-font-heading)',
    fontWeight: 'var(--gravity-font-weight-semibold)',
    lineHeight: 'var(--gravity-line-height-tight)',
    letterSpacing: 'var(--gravity-letter-spacing-tight)',
  },
  h1: {
    fontSize: 'var(--gravity-text-h1)',
    fontFamily: 'var(--gravity-font-heading)',
    fontWeight: 'var(--gravity-font-weight-semibold)',
    lineHeight: 'var(--gravity-line-height-snug)',
    letterSpacing: 'var(--gravity-letter-spacing-tight)',
  },
  h2: {
    fontSize: 'var(--gravity-text-h2)',
    fontFamily: 'var(--gravity-font-heading)',
    fontWeight: 'var(--gravity-font-weight-semibold)',
    lineHeight: 'var(--gravity-line-height-snug)',
    letterSpacing: 'var(--gravity-letter-spacing-tight)',
  },
  h3: {
    fontSize: 'var(--gravity-text-h3)',
    fontFamily: 'var(--gravity-font-heading)',
    fontWeight: 'var(--gravity-font-weight-semibold)',
    lineHeight: 'var(--gravity-line-height-snug)',
    letterSpacing: 'var(--gravity-letter-spacing-normal)',
  },
  h4: {
    fontSize: 'var(--gravity-text-h4)',
    fontFamily: 'var(--gravity-font-heading)',
    fontWeight: 'var(--gravity-font-weight-semibold)',
    lineHeight: 'var(--gravity-line-height-snug)',
    letterSpacing: 'var(--gravity-letter-spacing-normal)',
  },
  h5: {
    fontSize: 'var(--gravity-text-h5)',
    fontFamily: 'var(--gravity-font-heading)',
    fontWeight: 'var(--gravity-font-weight-medium)',
    lineHeight: 'var(--gravity-line-height-snug)',
    letterSpacing: 'var(--gravity-letter-spacing-normal)',
  },
  h6: {
    fontSize: 'var(--gravity-text-h6)',
    fontFamily: 'var(--gravity-font-heading)',
    fontWeight: 'var(--gravity-font-weight-medium)',
    lineHeight: 'var(--gravity-line-height-normal)',
    letterSpacing: 'var(--gravity-letter-spacing-normal)',
  },
  bodyXl: {
    fontSize: 'var(--gravity-text-body-xl)',
    fontFamily: 'var(--gravity-font-body)',
    fontWeight: 'var(--gravity-font-weight-normal)',
    lineHeight: 'var(--gravity-line-height-relaxed)',
    letterSpacing: 'var(--gravity-letter-spacing-normal)',
  },
  bodyLg: {
    fontSize: 'var(--gravity-text-body-lg)',
    fontFamily: 'var(--gravity-font-body)',
    fontWeight: 'var(--gravity-font-weight-normal)',
    lineHeight: 'var(--gravity-line-height-relaxed)',
    letterSpacing: 'var(--gravity-letter-spacing-normal)',
  },
  body: {
    fontSize: 'var(--gravity-text-body)',
    fontFamily: 'var(--gravity-font-body)',
    fontWeight: 'var(--gravity-font-weight-normal)',
    lineHeight: 'var(--gravity-line-height-normal)',
    letterSpacing: 'var(--gravity-letter-spacing-normal)',
  },
  bodySm: {
    fontSize: 'var(--gravity-text-body-sm)',
    fontFamily: 'var(--gravity-font-body)',
    fontWeight: 'var(--gravity-font-weight-normal)',
    lineHeight: 'var(--gravity-line-height-normal)',
    letterSpacing: 'var(--gravity-letter-spacing-normal)',
  },
  bodyXs: {
    fontSize: 'var(--gravity-text-body-xs)',
    fontFamily: 'var(--gravity-font-body)',
    fontWeight: 'var(--gravity-font-weight-medium)',
    lineHeight: 'var(--gravity-line-height-normal)',
    letterSpacing: 'var(--gravity-letter-spacing-wide)',
  },
  label: {
    fontSize: 'var(--gravity-text-body-sm)',
    fontFamily: 'var(--gravity-font-body)',
    fontWeight: 'var(--gravity-font-weight-medium)',
    lineHeight: 'var(--gravity-line-height-normal)',
    letterSpacing: 'var(--gravity-letter-spacing-wide)',
    textTransform: 'uppercase' as const,
  },
  caption: {
    fontSize: 'var(--gravity-text-body-xs)',
    fontFamily: 'var(--gravity-font-body)',
    fontWeight: 'var(--gravity-font-weight-normal)',
    lineHeight: 'var(--gravity-line-height-normal)',
    letterSpacing: 'var(--gravity-letter-spacing-normal)',
  },
  code: {
    fontSize: 'var(--gravity-text-body-sm)',
    fontFamily: 'var(--gravity-font-mono)',
    fontWeight: 'var(--gravity-font-weight-normal)',
    lineHeight: 'var(--gravity-line-height-normal)',
    letterSpacing: 'var(--gravity-letter-spacing-normal)',
  },
};

export type TypographyVariant = keyof typeof typographyRules;
