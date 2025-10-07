# @gravityai-dev/design-system

AI-powered design system with server-driven components and design tokens.

## Features

- 🎨 **Design Tokens** - CSS variables for theming
- 🔄 **Server-Driven** - Components defined and styled server-side
- ⚡ **Performance** - Component definitions cached forever
- 🎯 **Type-Safe** - Full TypeScript support
- 🌈 **Themeable** - Override tokens per component or globally
- 📦 **Lightweight** - No Tailwind dependency (uses CSS variables)

## Installation

```bash
npm install @gravityai-dev/design-system
```

## Usage

```jsx
import { Card, DesignSystemProvider } from '@gravityai-dev/design-system';

function App() {
  return (
    <DesignSystemProvider apiUrl="http://localhost:4000">
      <Card 
        title="Hello World"
        description="This is a card"
      />
    </DesignSystemProvider>
  );
}
```

**Note:** The `apiUrl` points to your Gravity uWebSockets.js server that serves:
- Component definitions: `GET /api/components/:componentId`
- Page data: `GET /api/pages/now/:userId/:slug`
- Design tokens/themes: `GET /api/themes/:themeId`

## Design Tokens

Override tokens globally or per component:

```jsx
// Global theme
<DesignSystemProvider 
  theme={{
    '--ds-color-primary': '#10b981',
    '--ds-font-heading': 'Inter, sans-serif'
  }}
>
  <Card />
</DesignSystemProvider>

// Per component
<Card 
  theme={{
    '--ds-card-bg': '#f3f4f6'
  }}
/>
```

## Architecture

See [ARCHITECTURE.md](../../ARCHITECTURE.md) for complete system architecture.
