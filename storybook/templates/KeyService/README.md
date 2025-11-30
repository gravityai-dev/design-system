# KeyService Template

Full-screen split layout template inspired by NowModern design.

## Overview

KeyService provides a modern, full-screen split layout with:
- **Left side**: Scrollable content area displaying workflow components
- **Right side**: Fixed full-height image (non-scrollable)
- **Optional logo**: Top-left corner with configurable link

## Layout

```
┌─────────────────────────────────────────┐
│ [Logo]                                  │
│ ┌──────────────┬──────────────────────┐ │
│ │              │                      │ │
│ │   Content    │                      │ │
│ │   (scroll)   │    Image (fixed)     │ │
│ │              │                      │ │
│ │              │                      │ │
│ └──────────────┴──────────────────────┘ │
└─────────────────────────────────────────┘
```

## Features

### Response-Based Architecture
- Renders the **latest assistant response** only
- Each response can contain multiple components
- Supports streaming state with loading animation
- Auto-scrolls to top when new response arrives

### Split-Screen Design
- **Left panel (50%)**: Scrollable content with max-width container
- **Right panel (50%)**: Fixed position, full-height image display
- Responsive: Full-width on mobile, split on desktop (lg breakpoint)

### Image Handling
- Automatically detects image-type components (KenBurnsImage, etc.)
- Renders first image component on right side
- Fallback gradient if no image component found
- Non-image components render on left side

## Usage

```tsx
import KeyService from "./KeyService";

<KeyService
  client={gravityClient}
  logoUrl="https://example.com/logo.png"
  logoLink="/"
  onStateChange={(state) => console.log(state)}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `client` | `GravityClient` | Required | Gravity client with history and websocket |
| `onStateChange` | `(state: any) => void` | - | Callback when template state changes |
| `logoUrl` | `string` | - | URL for logo image |
| `logoLink` | `string` | - | Link when logo is clicked |
| `workflowState` | `string` | - | Injected by ComponentRenderer |
| `isStreaming` | `boolean` | - | Auto-derived from workflowState |

## Component Rendering

### Left Side (Content)
Renders all non-image components from the latest response:
- Card components
- AIResponse components
- Text components
- Any other UI components

### Right Side (Image)
Renders the first image-type component found:
- KenBurnsImage
- Any component with "image" in componentType
- Falls back to gradient if no image

## States

### Empty State
Shows welcome message when no responses exist.

### Streaming State
Shows bouncing dots animation while workflow is running.

### Complete State
Displays all components from the latest response.

## Storybook Stories

1. **Empty** - No content, waiting state
2. **Streaming** - Loading animation only
3. **StreamingWithContent** - Loading with partial content
4. **WithContent** - Full content (Card + Image)
5. **WithoutLogo** - Content without logo

## Design System Integration

Uses Tailwind CSS classes compatible with the design system:
- Dark mode support (`dark:` variants)
- Responsive breakpoints (`lg:` for desktop)
- Smooth animations and transitions
- Consistent spacing and typography

## Workflow Integration

The template automatically:
1. Receives `WORKFLOW_STARTED` → Creates response with `streamingState: 'streaming'`
2. Receives `COMPONENT_INIT` → Adds components to current response
3. Receives `COMPONENT_DATA` → Components auto-update via Zustand
4. Receives `WORKFLOW_COMPLETED` → Updates response to `streamingState: 'complete'`

## Example Workflow

```typescript
// Workflow sends components
{
  type: "COMPONENT_INIT",
  chatId: "chat_123",
  nodeId: "card1",
  component: {
    type: "Card",
    props: { title: "Welcome", description: "..." }
  }
}

{
  type: "COMPONENT_INIT",
  chatId: "chat_123",
  nodeId: "image1",
  component: {
    type: "KenBurnsImage",
    props: { src: "https://...", alt: "Hero" }
  }
}
```

Result:
- Card renders on left side (scrollable)
- KenBurnsImage renders on right side (fixed)
- Both components in same response
- Streaming animation shows until workflow completes

## Styling

### Left Panel
- Max width: 2xl (672px)
- Padding: 8 (mobile) / 16 (desktop)
- Vertical padding: 20 (mobile) / 24 (desktop)
- Smooth scrolling with webkit optimization

### Right Panel
- Fixed position (right: 0, top: 0, bottom: 0)
- Hidden on mobile, visible on desktop (lg+)
- Background: gray-900 fallback
- Full-height image container

### Logo
- Absolute position (top-left)
- z-index: 50 (above content)
- Padding: 6 (1.5rem)
- Height: 12 (3rem)
- Hover scale animation

## Accessibility

- Semantic HTML structure
- Alt text for images
- Keyboard navigation support
- Screen reader friendly
- Smooth scroll behavior

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox
- Tailwind CSS v3+
- React 18+
