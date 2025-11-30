# Gravity Templates

<!-- LLM: This is the complete guide for creating layout templates in the Gravity Design System. Templates are layout containers that render conversation history. -->

## Overview

**Templates** are layout components that receive conversation history from the `HistoryManager` and decide how to render it.

All templates extend `GravityTemplate` to ensure a consistent API.

**Key Distinction:**

- **Templates** = Layout containers (NOT workflow nodes, NOT sent by AI)
- **Components** = UI elements (become workflow nodes, sent by AI)

> 📖 **For component documentation**, see [/storybook/components/README.md](../components/README.md)

## Template Switching & Stacking

Templates can be switched or stacked dynamically by the workflow via metadata:

```javascript
// In workflow metadata (InputTrigger or MCP call)
metadata: {
  template: "BookingWidgetLayout",  // Which template to load
  templateMode: "stack"  // "switch" | "stack" | "replace"
}
```

**Template Modes:**

- **`switch`** (default): Replace all templates with the new one
- **`stack`**: Add new template as overlay on top of existing templates
- **`replace`**: Replace only the top template in the stack

**How it works:**

1. Workflow sends `WORKFLOW_STARTED` event with `metadata.template` and `metadata.templateMode`
2. Client automatically loads and renders the template(s)
3. **All history and component state persists** - same Zustand store
4. Components continue to work across template changes

**Example: Stacked booking overlay**

```
User: "I need a hotel"
├─ ChatLayout (base layer)
│  └─ AI shows RoomCard components
│
User: "Show me the booking form"
├─ Workflow sends: { template: "BookingWidgetLayout", templateMode: "stack" }
├─ Client stacks BookingWidgetLayout on top
│  └─ ChatLayout still visible underneath
│  └─ BookingWidget overlays on top
│  └─ User can see chat history behind the form
│
User: "Close booking form"
├─ Workflow sends: { template: "ChatLayout", templateMode: "switch" }
├─ Client removes overlay, back to single template
│  └─ All components still there, same state
```

**Example: Full template switch**

```
User: "Show me my dashboard"
├─ Workflow sends: { template: "DashboardLayout", templateMode: "switch" }
├─ Client replaces ChatLayout entirely
│  └─ Different layout, same component state
│  └─ All previous components still in Zustand
```

**Best practices:**

- ✅ Use template switching for major UI mode changes
- ✅ Keep component state in Zustand (survives template switches)
- ✅ Templates should handle missing components gracefully
- ❌ Don't rely on template-specific state (will be lost on switch)

**Implementation in workflows:**

```javascript
// Option 1: Set template in InputTrigger metadata (base template)
{
  "nodeId": "inputtrigger6",
  "type": "InputTrigger",
  "config": {
    "metadata": {
      "template": "ChatLayout",  // Base template
      "templateMode": "switch"   // Default mode
    }
  }
}

// Option 2: Stack template via MCP call
// When calling a workflow via MCP (e.g., createBooking)
metadata: {
  mcpName: "createBooking",
  mcpCategory: "Booking",
  targetTriggerNode: "inputtrigger6",
  template: "BookingWidgetLayout",  // Overlay template
  templateMode: "stack"  // Stack on top of existing
}

// Option 3: Replace top template
metadata: {
  template: "ConfirmationLayout",
  templateMode: "replace"  // Replace only the top layer
}

// Option 4: Full switch (clear stack)
metadata: {
  template: "DashboardLayout",
  templateMode: "switch"  // Clear stack, single template
}
```

**Use cases:**

- **`stack`**: Modals, overlays, booking forms, detail views
- **`replace`**: Multi-step wizards (replace current step)
- **`switch`**: Major navigation (dashboard, settings, different app sections)

### Universal State Architecture

**All component data lives in a global Zustand store** - this enables AI-powered customer journeys to advance through multiple templates while retaining complex state.

**The Vision: Multi-Template Customer Journeys**

An AI-powered CX journey might flow through multiple templates:

1. **ChatLayout** - Initial conversation, understanding needs
2. **FormLayout** - Collecting structured information
3. **BookingLayout** - Selecting options, making decisions
4. **DashboardLayout** - Reviewing selections, tracking progress
5. **ChatLayout** - Final confirmation, follow-up questions

**Throughout this journey:**

- ✅ **All component data persists** - stored in global Zustand by `nodeId`
- ✅ **Components work in any template** - same RoomCard in chat, grid, or dashboard
- ✅ **Seamless template transitions** - switch layouts without losing state
- ✅ **Complex data retained** - booking details, user preferences, AI recommendations
- ✅ **Real-time updates continue** - AI streams data regardless of current template

**Example Journey: Hotel Booking**

```
User: "I need a hotel in Paris"
├─ ChatLayout: AI asks questions, shows RoomCard components
│  └─ RoomCard data streams in: prices, availability, photos
│
User: "Show me options in a grid"
├─ BookingLayout: Same RoomCard components, different layout
│  └─ RoomCard data persists, AI adds recommendations
│
User: "Book the deluxe room"
├─ FormLayout: Payment form, RoomCard shows selected room
│  └─ RoomCard data still there, form validates against it
│
User: "Show my booking"
└─ DashboardLayout: Confirmation, RoomCard in summary widget
   └─ RoomCard data complete, shows final booking details
```

---

## Benefits of Universal State Architecture

### 1. **AI-Orchestrated User Journeys**

- AI can dynamically switch templates based on conversation context
- "Show me options" → BookingLayout | "Let's chat about it" → ChatLayout
- Seamless transitions feel natural, not like page navigation
- AI controls the entire UX flow programmatically

### 2. **State Persistence Across Templates**

- Complex data (bookings, preferences, selections) never lost
- Switch from chat → grid → form → dashboard → back to chat
- All component data retained in global Zustand store
- No need to "rebuild" state when changing views

### 3. **Component Reusability**

- Same component works in ANY template
- `RoomCard` in ChatLayout timeline, BookingLayout grid, DashboardLayout widget
- Write once, use everywhere
- Components don't care about their container

### 4. **Real-Time Streaming Everywhere**

- AI streams data updates regardless of current template
- Component in chat receives same updates as component in dashboard
- User can switch templates mid-stream without interruption
- Data continues flowing seamlessly

### 5. **Flexible User Experience**

- Users can request different views: "Show me a grid" | "Switch to timeline"
- Power users get dashboards, casual users get chat
- Same data, different presentations
- Personalized UX without rebuilding state

### 6. **Multi-Step Workflows**

- Complex processes (booking, onboarding, configuration) span multiple templates
- Each step can use optimal template (form, wizard, chat, grid)
- State carries forward through entire workflow
- No data loss between steps

### 7. **Developer Experience**

- **Design System Components** - Pure, stateless, testable
- **Templates** - Just layout logic, no state management
- **Client App** - Handles all Zustand wiring with simple HOC
- Clear separation of concerns

### 8. **Scalability**

- Add new templates without touching components
- Add new components without touching templates
- Templates and components evolve independently
- Global state scales to hundreds of components

### 9. **Testing & Debugging**

- Components testable in isolation (pure functions)
- Templates testable with mock history
- Zustand state inspectable in dev tools
- Time-travel debugging through state changes

### 10. **Future-Proof**

- Easy to add: voice interfaces, mobile apps, AR/VR
- Same components, same state, different templates
- State lives in Zustand, not tied to any UI framework
- Can migrate templates without touching business logic

---

## Component Data Prop Pattern

### Why Nested Data Objects?

Components that handle complex data structures (like `BookingWidget`) accept data as a **single nested prop** rather than flattened individual props.

**Example:**

```tsx
// ✅ CORRECT: Nested data object
<BookingWidget
  bookingData={{
    date: "2025-10-28",
    time: "14:00",
    patientName: "John Doe",
    email: "john@example.com"
  }}
/>

// ❌ AVOID: Flattened props
<BookingWidget
  date="2025-10-28"
  time="14:00"
  patientName="John Doe"
  email="john@example.com"
/>
```

### Rationale

**1. Workflow Data Binding**
In server-driven workflows, AI outputs are bound directly to component props:

```javascript
// Workflow node configuration
return signal.bedrock.output; // Returns { date, time, patientName, email }
```

This output becomes `config.bookingData` and is passed as a single prop, enabling clean template expressions.

**2. Type Safety**

```typescript
interface BookingData {
  date?: string;
  time?: string;
  patientName?: string;
  // ... 10+ more fields
}

interface BookingWidgetProps {
  bookingData?: BookingData; // Single typed object
  onConfirm?: (data: BookingData) => void;
}
```

**3. Clear Separation**

- **Data props** (bookingData, userData, orderData) = Dynamic content from AI
- **Behavior props** (onConfirm, onCancel, editable) = Component configuration

**4. Easier Refactoring**
Adding new data fields doesn't change the component's prop signature:

```typescript
// Adding a new field is just:
bookingData.notes = "Special requirements";

// vs. adding a new prop:
<BookingWidget ... notes="..." />  // Breaks existing usage
```

**5. Consistent with Industry Patterns**

- React Hook Form: `<Controller control={control} />`
- Material-UI: `<DataGrid rows={rows} />`
- Ant Design: `<Form initialValues={values} />`

### When to Use Nested Props

Use nested data props when:

- ✅ Component handles 5+ related data fields
- ✅ Data comes from a single workflow output
- ✅ Data represents a cohesive entity (booking, user, order)
- ✅ Component needs to pass data back via callbacks

Use flat props when:

- ✅ Component has <5 simple configuration options
- ✅ Props are independent (not related data)
- ✅ Component is purely presentational

---

## Real-World Use Cases

**E-Commerce:**

- ChatLayout → Product discovery
- GalleryLayout → Browse products
- ComparisonLayout → Compare options
- FormLayout → Checkout
- DashboardLayout → Order tracking

**Healthcare:**

- ChatLayout → Symptom discussion
- FormLayout → Medical history
- CalendarLayout → Appointment booking
- DashboardLayout → Health tracking

**Travel Booking:**

- ChatLayout → Destination planning
- MapLayout → Location exploration
- BookingLayout → Hotel/flight selection
- TimelineLayout → Itinerary building
- DashboardLayout → Trip management

**Financial Services:**

- ChatLayout → Financial advice
- DashboardLayout → Portfolio overview
- ComparisonLayout → Investment options
- FormLayout → Account setup
- TimelineLayout → Transaction history

---

## Architecture

```
GravityTemplate (Base)
├── ChatLayout (Sequential messages)
├── BookingLayout (Master widget + updates)
├── DashboardLayout (Grid of widgets)
└── FormLayout (Multi-step wizard)

All templates share the same:
- Zustand store (component data)
- HistoryManager (conversation timeline)
- WebSocket connection (streaming updates)
```

---

## GravityTemplate.tsx - The Bridge

**GravityTemplate.tsx** is the contract between the client application and design system templates.

### What It Provides

1. **Type Definitions** (Single Source of Truth)

   - `HistoryEntry` - Structure of conversation entries
   - `GravityClient` - Client API for templates
   - `SessionParams` - Session/workflow context
   - `GravityTemplateProps` - Base props all templates receive

2. **Hooks**

   - `useGravityClient(client)` - Get history and sendMessage
   - `useGravityTemplate(history)` - Utility methods for filtering

3. **Base Classes** (Optional)
   - `GravityTemplate` - Class-based template base
   - `GravityTemplateFn` - Functional template interface

### Template Props Interface

```typescript
interface GravityTemplateProps {
  /** Client context with all utilities */
  client: GravityClient;

  /** Callback: Template shares state back to client */
  onStateChange?: (state: any) => void;

  /** Workflow state from Zustand (injected by ComponentRenderer) */
  workflowState?: "WORKFLOW_STARTED" | "WORKFLOW_COMPLETED" | null;
  workflowId?: string | null;
  workflowRunId?: string | null;

  /** Streaming state (auto-derived from workflowState) */
  isStreaming?: boolean;

  /** Template-specific props */
  [key: string]: any;
}
```

### GravityClient Interface

```typescript
interface GravityClient {
  history: {
    entries: HistoryEntry[];
    addUserMessage: (message: string, metadata?: any) => UserMessage;
    addResponse: (responseData?: Partial<AssistantResponse>) => AssistantResponse;
    updateResponse: (id: string, updates: Partial<AssistantResponse>) => AssistantResponse | null;
    addComponentToResponse: (responseId: string, componentData: any, loadedComponent?: any) => AssistantResponse | null;
    getResponses: () => AssistantResponse[];
    // Backward compatibility - deprecated
    addComponent?: (componentData: any, loadedComponent?: any) => AssistantResponse;
    updateEntry?: (id: string, updates: any) => HistoryEntry | null;
  };
  websocket: {
    sendUserAction: (action: string, data: any) => void;
  };
  session: SessionParams;
}
```

**Response Lifecycle:**

```typescript
// 1. When workflow starts
const response = client.history.addResponse({
  chatId: userMessage.chatId,
  streamingState: "streaming",
  components: [],
});

// 2. As components arrive
client.history.addComponentToResponse(
  response.id,
  {
    type: "Card",
    nodeId: "node-123",
    props: { title: "Hello" },
  },
  LoadedComponent
);

// 3. When workflow completes
client.history.updateResponse(response.id, {
  streamingState: "complete",
});
```

---

## History Entry Structure

**Defined in GravityTemplate.tsx** (single source of truth):

### Universal Response-Based Architecture

History entries are now **response-based** - each AI response can contain **multiple components** and has its own **streaming state**.

```typescript
// Union type - discriminated by 'type' field
type HistoryEntry = UserMessage | AssistantResponse;

// Simple user message
interface UserMessage {
  id: string;
  type: "user_message";
  role: "user";
  content: string;
  timestamp: string;
  chatId?: string;
}

// Assistant response - can contain multiple components
interface AssistantResponse {
  id: string;
  type: "assistant_response";
  role: "assistant";
  streamingState: StreamingState; // Local to this response!
  components: ResponseComponent[]; // Multiple components!
  timestamp: string;
  chatId?: string;
}

// Component within a response
interface ResponseComponent {
  id: string;
  componentType: string;
  componentUrl?: string;
  nodeId?: string; // Node ID for Zustand subscription
  chatId?: string;
  props?: Record<string, any>;
  metadata?: Record<string, any>;
  Component?: any; // Loaded component (already wrapped with withZustandData)
}

enum StreamingState {
  IDLE = "idle",
  STREAMING = "streaming", // Workflow is running
  COMPLETE = "complete", // Workflow finished
}
```

**Key Changes:**

- ✅ **Response-based** - Components grouped into responses, not individual entries
- ✅ **Per-response streaming** - Each response has its own state (not global)
- ✅ **Multiple components** - One response can contain image + card + text
- ✅ **Clean separation** - User messages vs assistant responses

**Key Fields:**

- `chatId` - Generated per user message, links request → response
- `streamingState` - Local to each response, indicates if workflow is running
- `components[]` - Array of components in this response
- `nodeId` - Workflow node ID, used for Zustand subscription key
- `Component` - Pre-wrapped with `withZustandData` HOC before reaching template

---

## Creating a Template

<!-- LLM: Complete step-by-step guide for creating a new template. Templates render conversation history. -->

### Step 1: Define Types (Import from GravityTemplate)

```typescript
// types.ts
import type { HistoryEntry, GravityClient, SessionParams } from "../GravityTemplate";

// Re-export core types
export type { HistoryEntry, GravityClient, SessionParams };

// Define template-specific props
export interface MyTemplateProps {
  client: GravityClient;
  onStateChange?: (state: any) => void;
  isStreaming?: boolean;
  // ... template-specific props
}
```

### Step 2: Create Template Component

```typescript
// MyTemplate.tsx
import { useGravityClient } from "../GravityTemplate";
import type { MyTemplateProps } from "./types";

export default function MyTemplate(props: MyTemplateProps) {
  const { client } = props;

  // Get history and sendMessage from client
  const { history, sendMessage } = useGravityClient(client);

  return (
    <div>
      {history.map((entry) => {
        // User message
        if (entry.type === "user_message") {
          return <div key={entry.id}>{entry.content}</div>;
        }

        // Assistant response - can contain multiple components
        if (entry.type === "assistant_response") {
          const { streamingState, components } = entry;

          return (
            <div key={entry.id}>
              {/* Show animation when workflow is running */}
              {streamingState === "streaming" && <LoadingAnimation />}

              {/* Render all components in this response */}
              {components.map((component) => {
                const { Component, props, id, nodeId, chatId } = component;
                if (!Component) return null;

                return (
                  <Component
                    key={id}
                    {...props}
                    nodeId={nodeId}
                    chatId={chatId}
                    streamingState={streamingState} // Pass response state to components
                  />
                );
              })}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
```

### The Beautiful Simplicity

**That's it!** Your template:

- ✅ Gets `history` from `useGravityClient(client)`
- ✅ Each response has its own `streamingState` (not global)
- ✅ One response can contain multiple components
- ✅ Just maps and renders - components handle their own state
- ✅ No manual Zustand subscriptions needed
- ✅ No complex state management
- ✅ State changes → Components react → UI updates

**Key Insight: Streaming State is Local**

- Each `AssistantResponse` has its own `streamingState`
- Multiple responses can stream simultaneously
- Animation shows when `streamingState === 'streaming'`
- Animation is independent of whether components have arrived

### Option 2: Class Component

```typescript
import { GravityTemplate, GravityTemplateProps } from "../GravityTemplate";

export interface MyTemplateProps extends GravityTemplateProps {
  customProp?: string;
}

export default class MyTemplate extends GravityTemplate<MyTemplateProps> {
  render() {
    const responses = this.getResponses(); // Get assistant responses
    const userMessages = this.getUserMessages(); // Get user messages

    return <div>{/* Your template layout */}</div>;
  }
}
```

---

## Template Patterns

### Pattern: Dynamic Component Rendering

All templates use the **same pattern** - render components dynamically from workflow history using helper functions.

**Core Concept:**

- Components arrive from workflow already wrapped with Zustand
- Use `filterComponents()` to select which components to render
- Use `renderComponent()` to render them
- Components auto-update as workflow streams data

---

## Creating a Template - Simple Example

```typescript
import { useGravityClient, renderComponent, filterComponents } from "../GravityTemplate";

export default function MyTemplate({ client }) {
  const { history } = useGravityClient(client);
  const latest = history.filter((e) => e.type === "assistant_response").pop();
  const components = latest?.components || [];

  return <div>{filterComponents(components, { exclude: ["image"] }).map((c) => renderComponent(c))}</div>;
}
```

**That's it!** Components stream in real-time automatically.

---

## Helper Functions

### `renderComponent(component, additionalProps?)`

Renders a component from workflow history with all required props.

```typescript
// Simple render
{
  components.map((c) => renderComponent(c));
}

// With additional props
{
  components.map((c) => renderComponent(c, { className: "mb-4" }));
}
```

**What it does:**

- Spreads component props
- Passes `nodeId` and `chatId` for Zustand subscription
- Handles null/undefined components
- Returns JSX with proper key

---

### `filterComponents(components, options)`

Filter and order components by type.

**Options:**

- `include` - Only include these types (by nodeId, componentType, or metadata.category)
- `exclude` - Exclude these types
- `order` - Sort by include list order (use with `include`)

```typescript
// Only images
filterComponents(components, { include: ["kenburnsimage"] });

// Everything except images
filterComponents(components, { exclude: ["kenburnsimage"] });

// Specific order: AIResponse first, then Card, then rest
filterComponents(components, {
  include: ["airesponse", "card", "*"],
  order: true,
});

// Multiple exclusions
filterComponents(components, { exclude: ["image", "video"] });
```

**The `'*'` wildcard** includes all remaining components at that position.

---

## Template Examples

### ChatLayout - Full History

Shows all conversation history chronologically.

```typescript
export default function ChatLayout({ client }) {
  const { history } = useGravityClient(client);

  return (
    <div>
      {history.map((entry) => {
        if (entry.type === "assistant_response") {
          return entry.components.map((c) => renderComponent(c));
        }
        return <UserMessage key={entry.id} content={entry.content} />;
      })}
    </div>
  );
}
```

---

### KeyService - Split Layout with Ordering

Fixed layout: content on left (ordered), images on right.

```typescript
export default function KeyService({ client }) {
  const { history } = useGravityClient(client);
  const latest = history.filter((e) => e.type === "assistant_response").pop();
  const components = latest?.components || [];

  return (
    <div className="grid lg:grid-cols-2">
      {/* LEFT - AIResponse first, then Card, then rest */}
      <div>
        {filterComponents(components, {
          include: ["airesponse", "card", "*"],
          exclude: ["kenburnsimage"],
          order: true,
        }).map((c) => renderComponent(c))}
      </div>

      {/* RIGHT - Images only */}
      <div>{filterComponents(components, { include: ["kenburnsimage"] }).map((c) => renderComponent(c))}</div>
    </div>
  );
}
```

---

### Dashboard - Grid Layout

Components in a grid, specific types in specific positions.

```typescript
export default function Dashboard({ client }) {
  const { history } = useGravityClient(client);
  const latest = history.filter((e) => e.type === "assistant_response").pop();
  const components = latest?.components || [];

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Top row - metrics */}
      <div className="col-span-3">
        {filterComponents(components, { include: ["metric"] }).map((c) => renderComponent(c))}
      </div>

      {/* Bottom row - charts and tables */}
      <div className="col-span-2">
        {filterComponents(components, { include: ["chart"] }).map((c) => renderComponent(c))}
      </div>
      <div>{filterComponents(components, { include: ["table"] }).map((c) => renderComponent(c))}</div>
    </div>
  );
}
```

---

## Key Principles

### 1. Components Are Pre-Wrapped

Components arrive from workflow **already wrapped with Zustand**. You don't need to:

- Import components from design system
- Wrap them yourself
- Manage subscriptions
- Handle streaming

Just render them with `renderComponent()`.

### 2. Use nodeId for Filtering

Filter by `nodeId` (from your workflow) instead of `componentType`:

```typescript
// ✅ Good - uses workflow nodeId
filterComponents(components, { include: ["airesponse", "kenburnsimage"] });

// ❌ Fragile - string matching on type
components.filter((c) => c.componentType?.includes("image"));
```

### 3. Order Matters

Use `order: true` with `include` list to control render order:

```typescript
// AIResponse always first, Card second, rest after
filterComponents(components, {
  include: ["airesponse", "card", "*"],
  order: true,
});
```

### 4. Component Width Best Practices

**All design system components should use `w-full` to fill their container:**

```typescript
// ✅ Good - component fills container width
<div className="w-full border rounded-lg ...">

// ❌ Bad - fixed width breaks layout in templates
<div className="w-[800px] border rounded-lg ...">

// ❌ Bad - minimum width can cause overflow
<div className="min-w-[600px] border rounded-lg ...">
```

**Why:**

- Templates control layout with containers (e.g., `max-w-4xl`)
- Components should be flexible and responsive to their container
- `w-full` ensures components fill available space without overflow
- Works correctly in ChatLayout, Dashboard, and all template types

**Example components:**

- `Card` - Vertical layout with `w-full`
- `Card2` - Horizontal layout (text left, image right) with `w-full`
- `AIResponse` - Text content with `w-full`

---

## When to Use Each Pattern

| Use Case            | Pattern          | Example                                    |
| ------------------- | ---------------- | ------------------------------------------ |
| **Chat/Timeline**   | Full history     | Map over all history entries               |
| **Landing Page**    | Latest only      | Get latest response, filter components     |
| **Dashboard**       | Latest + Grid    | Get latest, filter by type into grid cells |
| **Multi-step Form** | Latest + Ordered | Get latest, order components by priority   |

---

## Helper Utilities

### useGravityTemplate Hook

```typescript
const { getResponses, getUserMessages, getByRole, getLatest, getAllComponents } = useGravityTemplate(history);

// Get only assistant responses
const responses = getResponses();

// Get all components from all responses (flattened)
const allComponents = getAllComponents();

// Get only user messages
const messages = getUserMessages();

// Get by role
const assistantEntries = getByRole("assistant");

// Get latest entry
const latest = getLatest();
```

### GravityTemplate Class Methods

```typescript
class MyTemplate extends GravityTemplate {
  render() {
    // Protected methods available:
    this.getUserMessages(); // Get user messages
    this.getResponses(); // Get assistant responses
    this.getByRole("user"); // Filter by role
    this.getLatest(); // Get latest entry
    this.isStreaming; // getter (deprecated - use response.streamingState)
    this.sendMessage("Hello"); // calls onSend
  }
}
```

---

## Template Registration

Templates are automatically discovered from the `/templates` directory and bundled by the component generator.

**File Structure:**

```
templates/
├── GravityTemplate.tsx          # Base interface
├── ChatLayout/
│   ├── ChatLayout.tsx           # Main component
│   ├── types.ts                 # Type definitions
│   └── ChatLayout.stories.tsx   # Storybook stories
├── BookingLayout/
│   └── BookingLayout.tsx
└── DashboardLayout/
    └── DashboardLayout.tsx
```

---

## Key Principles

### 1. Templates Are Layout Logic Only

Templates focus purely on layout and rendering - they don't manage state or handle complex business logic.

### 2. History Is Universal

- Same history works for **any** template
- Client can switch templates mid-conversation
- Templates interpret history differently

### 3. Component Data Lives in Zustand

- **Components** = Pure React components (stateless)
- **Component Data** = Streamed from AI workflow → Zustand store
- **Templates** = Can use components anywhere, data auto-syncs
- Components automatically re-render when their data updates in Zustand

### 4. Templates Are Composable

- Can render other templates as children
- Can delegate to sub-layouts
- Can fetch their own data (e.g., booking engine fetches room types)
- Can use design system components anywhere in their layout

---

## Component Data Architecture

### The Flow:

**1. WORKFLOW_STARTED**

```
AI Workflow → WebSocket → Create AssistantResponse with streaming state
```

Server sends:

```json
{
  "type": "WORKFLOW_STARTED",
  "chatId": "chat_123",
  "workflowId": "workflow_456"
}
```

Client does:

1. **WebSocket** receives event
2. **Creates AssistantResponse** with `streamingState: 'streaming'`
3. **Template** shows animation (bouncing dots)

**2. COMPONENT_INIT (sent once per component instance)**

```
AI Workflow → WebSocket → Zustand → useHistoryManager → Loads & Wraps → Add to Response
```

Server sends:

```json
{
  "type": "COMPONENT_INIT",
  "chatId": "chat_123",
  "nodeId": "airesponse4",
  "component": {
    "type": "AIResponse",
    "componentUrl": "/components/AIResponse.js",
    "props": { "title": "Initial data" }
  }
}
```

Client does:

1. **WebSocket** receives event → Updates Zustand with `chatId:nodeId` key
2. **useHistoryManager** loads component from URL
3. **Wraps** with `withZustandData(Component)` HOC
4. **Adds to current response** using `addComponentToResponse()`
5. **Template** receives response with components array

**3. COMPONENT_DATA (sent multiple times for streaming)**

```
AI Workflow → WebSocket → Updates Zustand → Component auto-re-renders
```

Server sends:

```json
{
  "type": "COMPONENT_DATA",
  "chatId": "chat_123",
  "nodeId": "airesponse4",
  "data": { "progressText": "Analyzing...", "questions": ["..."] }
}
```

Client does:

1. **WebSocket** receives event
2. **Updates Zustand**: `data['chat_123:airesponse4'] = { ...existing, ...newData }`
3. **Wrapped component** subscribes to `data['chat_123:airesponse4']`
4. **Component automatically re-renders** with merged data
5. **Response keeps `streamingState: 'streaming'`** - animation continues
6. **Template doesn't know or care** - it just rendered the component once

**4. WORKFLOW_COMPLETED**

```
AI Workflow → WebSocket → Update response streaming state
```

Server sends:

```json
{
  "type": "WORKFLOW_COMPLETED",
  "chatId": "chat_123",
  "workflowId": "workflow_456"
}
```

Client does:

1. **WebSocket** receives event
2. **Updates response**: `updateResponse(responseId, { streamingState: 'complete' })`
3. **Template** stops showing animation
4. **Components remain** with their final data

**5. Templates render responses (beautifully simple)**

```typescript
// Template just maps and renders - that's it!
{
  history.map((entry) => {
    if (entry.type === "assistant_response") {
      const { streamingState, components } = entry;
      return (
        <div key={entry.id}>
          {/* Show animation when streaming */}
          {streamingState === "streaming" && <LoadingDots />}

          {/* Render all components */}
          {components.map((component) => {
            const { Component, props, id, nodeId, chatId } = component;
            return <Component key={id} {...props} nodeId={nodeId} chatId={chatId} streamingState={streamingState} />;
          })}
        </div>
      );
    }
  });
}
```

**What happens (automatically):**

1. Each component is **already wrapped** with Zustand subscription
2. Wrapped component reads from Zustand using `chatId:nodeId` composite key
3. Component merges static `props` + dynamic Zustand `data`
4. Component **automatically re-renders** when Zustand updates
5. Response `streamingState` controls animation visibility
6. Template **never touches Zustand** - just renders once

**The Beauty:**

- State changes → Components react → UI updates
- No manual subscriptions
- No imperative updates
- Pure reactive flow

### Client-Side Implementation: useHistoryManager

**The `useHistoryManager` hook handles the entire workflow lifecycle automatically.**

#### Sequential Event Queue

Events are processed **sequentially** using an event queue to prevent race conditions. This is critical because:

1. **`COMPONENT_INIT` is async** - Loading components from URLs takes time
2. **Multiple events arrive rapidly** - Server sends events faster than client can process
3. **Order matters** - Components must be added to history before receiving `COMPONENT_DATA`

**Without queue (race condition):**

```
Server sends:     COMPONENT_INIT(AIResponse) → COMPONENT_INIT(Card) → COMPONENT_DATA(AIResponse)
                         ↓                           ↓                        ↓
Client receives:  Start loading...            Start loading...         Update Zustand
                  (takes 200ms)               (takes 150ms)            (instant)
                         ↓                           ↓
                  Card finishes first!        AIResponse finishes
                         ↓
Result: Card added before AIResponse, streaming text interrupted!
```

**With queue (correct order):**

```
Server sends:     COMPONENT_INIT(AIResponse) → COMPONENT_INIT(Card) → COMPONENT_DATA(AIResponse)
                         ↓
Queue:            [AIResponse, Card, DATA]
                         ↓
Process:          await AIResponse → await Card → DATA updates Zustand
                         ↓
Result: Components added in correct order, streaming works!
```

**Implementation:**

```javascript
// apps/GravityAIClient/src/hooks/useHistoryManager.js

// Event queue for sequential processing
const eventQueueRef = useRef([]);
const isProcessingRef = useRef(false);

// Add events to queue (don't process immediately)
useEffect(() => {
  events.forEach((event) => {
    if (!processedEventIds.current.has(event.id)) {
      eventQueueRef.current.push(event);
    }
  });
  processQueue(); // Start processing
}, [events]);

// Process queue sequentially
const processQueue = async () => {
  if (isProcessingRef.current) return; // Prevent concurrent processing
  isProcessingRef.current = true;

  while (eventQueueRef.current.length > 0) {
    const event = eventQueueRef.current.shift();
    await processEvent(event); // Wait for each event to complete
    processedEventIds.current.add(event.id);
  }

  isProcessingRef.current = false;
};
```

#### Event Processing

```javascript
// Track active response per chatId
const activeResponsesRef = useRef({}); // { chatId: responseId }

// Process WORKFLOW_STATE events
if (event.type === "WORKFLOW_STATE") {
  if (event.state === "WORKFLOW_STARTED") {
    // Create response with streaming state
    const response = manager.addResponse({
      chatId: event.chatId,
      streamingState: "streaming",
      components: [],
    });
    // Track for this chatId
    activeResponsesRef.current[event.chatId] = response.id;
  }

  if (event.state === "WORKFLOW_COMPLETED") {
    // Update response to complete
    const responseId = activeResponsesRef.current[event.chatId];
    manager.updateResponse(responseId, { streamingState: "complete" });
  }
}

// Process COMPONENT_INIT events
if (event.type === "COMPONENT_INIT") {
  const responseId = activeResponsesRef.current[event.chatId];

  if (responseId) {
    // Add component to existing response (await ensures order)
    const LoadedComponent = await loadComponent(url, type);
    const WrappedComponent = withZustandData(LoadedComponent);
    manager.addComponentToResponse(responseId, componentData, WrappedComponent);
  } else {
    // Fallback: use deprecated addComponent() for backward compatibility
    manager.addComponent(componentData, WrappedComponent);
  }
}
```

**Key Implementation Details:**

- ✅ **`activeResponsesRef`** - Maps `chatId` → `responseId` to track which response to add components to
- ✅ **Automatic lifecycle** - Responses created/updated based on workflow events
- ✅ **Backward compatible** - Falls back to old method if no WORKFLOW_STATE events
- ✅ **Per-conversation isolation** - Each `chatId` gets its own response

### The HOC Pattern (Automatic Wrapping)

**Components are wrapped with Zustand subscription before being added to responses:**

```javascript
// apps/GravityAIClient/src/hooks/useHistoryManager.js
const LoadedComponent = await loadComponent(url, type);
const WrappedComponent = withZustandData(LoadedComponent);
manager.addComponentToResponse(responseId, componentData, WrappedComponent);
```

**The `withZustandData` HOC:**

```javascript
// apps/GravityAIClient/src/utils/withZustandData.js
function withZustandData(Component) {
  return function WrappedComponent({ nodeId, chatId, ...props }) {
    // Subscribe using chatId:nodeId composite key for per-conversation isolation
    const subscriptionKey = chatId && nodeId ? `${chatId}:${nodeId}` : nodeId;
    const storeData = useComponentData((state) => state.data[subscriptionKey] || {});

    // Merge static props + dynamic Zustand data
    const mergedProps = { ...props, ...storeData };

    // Render pure component with merged data
    return <Component {...mergedProps} />;
  };
}
```

**Key Insight: `chatId:nodeId` Composite Keys**

- Allows multiple instances of same component in history
- Each conversation turn gets isolated data
- Same component can appear multiple times with different data

**Result:**

- ✅ Components wrapped **before** reaching template
- ✅ Templates just render - no wrapping needed
- ✅ Design system components stay pure (no Zustand knowledge)
- ✅ Templates stay simple (just map and render)
- ✅ Client handles all Zustand wiring automatically

### Example: Booking Engine Template

```typescript
export default function BookingLayout({ client }) {
  const { history } = client;
  const [roomTypes, setRoomTypes] = useState([]);

  // Template can fetch its own data
  useEffect(() => {
    fetch("/api/room-types")
      .then((r) => r.json())
      .then(setRoomTypes);
  }, []);

  return (
    <div>
      {/* Template's own data */}
      <RoomTypeGrid rooms={roomTypes} />

      {/* AI workflow components (data from Zustand) */}
      {history.map((entry) => {
        if (entry.type === "assistant_response") {
          return entry.components.map((component) => (
            <component.Component key={component.id} nodeId={component.nodeId} {...component.props} />
          ));
        }
        return null;
      })}
    </div>
  );
}
```

The `RoomTypeGrid` component might be a design system component that:

- Receives initial room data from template's API call
- Gets AI-generated recommendations streamed via Zustand
- Updates in real-time as workflow processes user preferences

### Benefits:

✅ **Decoupled** - Components and data are separate  
✅ **Flexible** - Templates can use components anywhere  
✅ **Real-time** - Data streams in, components auto-update  
✅ **Single Source of Truth** - Zustand manages all component state  
✅ **Composable** - Mix template data + AI workflow data seamlessly

---

## Error Handling

### Component Load Failures

Templates should gracefully handle components that fail to load:

```typescript
export default function MyTemplate({ client }) {
  const { history } = useGravityClient(client);

  return (
    <div>
      {history.map((entry) => {
        if (entry.type === "assistant_response") {
          return entry.components.map((component) => {
            const { Component, props, id, nodeId, chatId } = component;

            // Handle missing component
            if (!Component) {
              return (
                <div key={id} className="error-fallback">
                  Component failed to load
                </div>
              );
            }

            return <Component key={id} {...props} nodeId={nodeId} chatId={chatId} />;
          });
        }
        return null;
      })}
    </div>
  );
}
```

### WebSocket Disconnections

The client handles WebSocket reconnection automatically, but templates can show connection status:

```typescript
export default function MyTemplate({ client }) {
  const { history, sendMessage } = useGravityClient(client);
  const isConnected = client.websocket?.connected ?? true;

  return (
    <div>
      {!isConnected && <div className="connection-warning">Reconnecting...</div>}
      {/* Rest of template */}
    </div>
  );
}
```

---

## Performance Optimization

### History Pagination

For long conversations, consider limiting rendered history:

```typescript
export default function ChatLayout({ client, maxMessages = 50 }) {
  const { history } = useGravityClient(client);

  // Only render recent messages
  const recentHistory = history.slice(-maxMessages);

  return (
    <div>
      {recentHistory.map((entry) => {
        // Render entries
      })}
    </div>
  );
}
```

### Component Memoization

Use React.memo for expensive components:

```typescript
const MemoizedComponent = React.memo(
  ({ nodeId, chatId, ...props }) => {
    return <Component {...props} nodeId={nodeId} chatId={chatId} />;
  },
  (prevProps, nextProps) => {
    // Custom comparison - only re-render if nodeId or chatId changes
    return prevProps.nodeId === nextProps.nodeId && prevProps.chatId === nextProps.chatId;
  }
);
```

### Virtual Scrolling

For templates with many components, use virtual scrolling:

```typescript
import { FixedSizeList } from "react-window";

export default function ChatLayout({ client }) {
  const { history } = useGravityClient(client);

  return (
    <FixedSizeList height={600} itemCount={history.length} itemSize={100}>
      {({ index, style }) => <div style={style}>{/* Render history[index] */}</div>}
    </FixedSizeList>
  );
}
```

---

## Migration Guide

### Deprecated Methods

If you're using older patterns, migrate to the response-based architecture:

**❌ Old Pattern (Deprecated):**

```typescript
// Don't use - backward compatibility only
client.history.addComponent(componentData, loadedComponent);
client.history.updateEntry(id, updates);
```

**✅ New Pattern (Recommended):**

```typescript
// 1. Create response when workflow starts
const response = client.history.addResponse({
  chatId: userMessage.chatId,
  streamingState: "streaming",
  components: [],
});

// 2. Add components to response
client.history.addComponentToResponse(response.id, componentData, loadedComponent);

// 3. Update response when complete
client.history.updateResponse(response.id, {
  streamingState: "complete",
});
```

### Global isStreaming → Per-Response streamingState

**❌ Old Pattern:**

```typescript
class MyTemplate extends GravityTemplate {
  render() {
    const isStreaming = this.isStreaming; // Deprecated
    return <div>{isStreaming && <Loading />}</div>;
  }
}
```

**✅ New Pattern:**

```typescript
export default function MyTemplate({ client }) {
  const { history } = useGravityClient(client);

  return (
    <div>
      {history.map((entry) => {
        if (entry.type === "assistant_response") {
          const { streamingState } = entry;
          return (
            <div key={entry.id}>
              {streamingState === "streaming" && <Loading />}
              {/* Render components */}
            </div>
          );
        }
      })}
    </div>
  );
}
```

---

## Troubleshooting

### Components Not Updating

**Problem:** Components render but don't update when data streams in.

**Solution:** Ensure components are wrapped with `withZustandData` before being added to responses. This happens automatically in `useHistoryManager`.

### Multiple Instances Show Same Data

**Problem:** Same component appears multiple times but all show identical data.

**Solution:** Ensure each component has a unique `chatId:nodeId` combination. The composite key provides per-conversation isolation.

```typescript
// ✅ Correct - unique keys
<Component nodeId="card1" chatId="chat_123" />
<Component nodeId="card1" chatId="chat_456" />

// ❌ Wrong - same key, will share data
<Component nodeId="card1" />
<Component nodeId="card1" />
```

### Streaming Animation Never Stops

**Problem:** Loading animation continues after workflow completes.

**Solution:** Ensure `WORKFLOW_COMPLETED` event updates the response:

```typescript
// In useHistoryManager
if (event.state === "WORKFLOW_COMPLETED") {
  const responseId = activeResponsesRef.current[event.chatId];
  manager.updateResponse(responseId, { streamingState: "complete" });
}
```

---

## Benefits

✅ **Consistent API** - All templates accept same props  
✅ **Flexible Rendering** - Each template interprets history differently  
✅ **Template Switching** - Change layout without losing history  
✅ **Type Safety** - TypeScript ensures compliance  
✅ **Reusable** - Templates work across all AI workflows  
✅ **Testable** - Easy to test with mock history

---

## Storybook Standards

### The 3-State Pattern

All templates follow a **standardized 3-state pattern** for Storybook stories:

1. **Initial** - User just opened the template (empty state)
2. **Streaming** - AI is working, workflow executing
3. **Complete** - All components rendered with data

**Why 3 states?**

- Maps to actual user experience
- Consistent across all templates
- Easy to understand and maintain
- No arbitrary variations

### Template Defaults Structure

Each template has a `defaults.tsx` file with:

```typescript
// defaults.tsx
import { StreamingState } from "../GravityTemplate";
import type { UserMessage, AssistantResponse } from "./types";

// Import real components
import AIResponse from "../../components/AIResponse/AIResponse";
import Card from "../../components/Card/Card";

// Import component defaults
import { AIResponseDefaults } from "../../components/AIResponse/defaults";
import { CardDefaults } from "../../components/Card/defaults";

// Use real components (no mocks!)
export const MockAIResponse = AIResponse;
export const MockCard = Card;

// STATE 1: INITIAL
export const mockHistoryInitial: (UserMessage | AssistantResponse)[] = [];

// STATE 2: STREAMING
export const mockHistoryStreaming: (UserMessage | AssistantResponse)[] = [
  {
    id: "msg-1",
    type: "user_message" as const,
    role: "user" as const,
    content: "Tell me about Jedi training",
    timestamp: new Date().toISOString(),
  },
  {
    id: "resp-1",
    type: "assistant_response" as const,
    role: "assistant" as const,
    streamingState: StreamingState.STREAMING,
    components: [], // No components yet - shows loading
    timestamp: new Date().toISOString(),
  },
];

// STATE 3: COMPLETE
export const mockHistoryComplete: (UserMessage | AssistantResponse)[] = [
  {
    id: "msg-1",
    type: "user_message" as const,
    role: "user" as const,
    content: "Tell me about Jedi training",
    timestamp: new Date().toISOString(),
  },
  {
    id: "resp-1",
    type: "assistant_response" as const,
    role: "assistant" as const,
    streamingState: StreamingState.COMPLETE,
    components: [
      {
        id: "comp-1",
        componentType: "AIResponse",
        componentUrl: "/components/AIResponse.js",
        props: AIResponseDefaults, // Use component defaults!
        Component: MockAIResponse,
      },
      {
        id: "comp-2",
        componentType: "Card",
        componentUrl: "/components/Card.js",
        props: CardDefaults, // Use component defaults!
        Component: MockCard,
      },
    ],
    timestamp: new Date().toISOString(),
  },
];

// Mock clients
export const mockClientInitial = createMockClient(mockHistoryInitial);
export const mockClientStreaming = createMockClient(mockHistoryStreaming);
export const mockClientComplete = createMockClient(mockHistoryComplete);
```

### Key Principles

**1. Import Component Defaults**

```typescript
// ✅ Good - import and use component defaults
import { AIResponseDefaults } from '../../components/AIResponse/defaults';
props: AIResponseDefaults

// ❌ Bad - duplicating data
props: { text: "...", progressText: "..." }

// ❌ Bad - empty props (components won't render)
props: {}
```

**2. Use Real Components**

```typescript
// ✅ Good - use actual components
import AIResponse from "../../components/AIResponse/AIResponse";
export const MockAIResponse = AIResponse;

// ❌ Bad - creating mock components
export const MockAIResponse = ({ text }: any) => <div>{text}</div>;
```

**3. One Source of Truth**

- Component defaults live in `/components/[Name]/defaults.ts`
- Template defaults import and use them
- No duplication, no drift

**4. Storybook Only**

- Defaults are ONLY for Storybook preview
- Production gets real data from workflow
- Components don't have hardcoded defaults in their implementation

### Template Stories Structure

**IMPORTANT: All templates MUST include the decorator for full-height rendering.**

```typescript
// MyTemplate.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import MyTemplate from "./MyTemplate";
import { mockClientInitial, mockClientStreaming, mockClientComplete, MyTemplateDefaults } from "./defaults.tsx";

const meta: Meta<typeof MyTemplate> = {
  title: "Templates/MyTemplate",
  component: MyTemplate,
  parameters: {
    layout: "fullscreen",
  },
  // REQUIRED: Decorator for full-height rendering
  decorators: [
    (Story) => (
      <div style={{ height: "100vh", width: "100vw" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MyTemplate>;

// Initial - User just opened
export const Initial: Story = {
  args: {
    client: mockClientInitial,
    ...MyTemplateDefaults,
  },
};

// Streaming - AI working
export const Streaming: Story = {
  args: {
    client: mockClientStreaming,
    ...MyTemplateDefaults,
  },
};

// Complete - Finished
export const Complete: Story = {
  args: {
    client: mockClientComplete,
    ...MyTemplateDefaults,
  },
};
```

### Benefits

✅ **Consistent** - All templates follow same pattern  
✅ **Simple** - 3 states, easy to understand  
✅ **No Duplication** - Component defaults reused  
✅ **Maintainable** - Change defaults once, affects all templates  
✅ **Realistic** - Shows actual user journey  
✅ **Testable** - Clear states to test

---

## Future Templates

Ideas for additional templates:

- **TimelineLayout** - Event timeline with filtering
- **KanbanLayout** - Drag-and-drop board
- **CalendarLayout** - Schedule/appointment view
- **MapLayout** - Location-based interface
- **GalleryLayout** - Image/media grid
- **ComparisonLayout** - Side-by-side comparison
- **WizardLayout** - Step-by-step guided flow

Each template receives the same `history` but renders it completely differently!
