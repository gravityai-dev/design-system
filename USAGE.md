# Gravity Design System - Usage Guide

## Architecture

**Server-side templates + Client-side rendering with 3 data sources**

1. **Server sends template** (HTML/CSS) → Cached in client
2. **Data comes from 3 sources:**
   - Streaming from server (GraphQL subscription)
   - Dynamic state (state machine)
   - Local DB (cached, super fast)

---

## Installation

```bash
npm install @gravityai-dev/design-system
```

---

## Data Source 1: Streaming from Server (GraphQL Subscription)

**Use case:** Real-time AI generation, live chat

```tsx
import { Card } from '@gravityai-dev/design-system';
import { useSubscription } from '@apollo/client';

function ChatPage() {
  const { data } = useSubscription(AI_RESULT, {
    variables: { conversationId: '123' }
  });

  // Server sends ComponentSpec
  return (
    <>
      {data?.cards?.map((cardEvent) => (
        <Card 
          key={cardEvent.id}
          component={cardEvent.component}  // ComponentSpec from server
          apiUrl="http://localhost:4000"
        />
      ))}
    </>
  );
}
```

**Server sends:**
```json
{
  "__typename": "Cards",
  "component": {
    "type": "Card",
    "props": {
      "title": "Golf Assessment",
      "description": "Improve your swing",
      "imageUrl": "https://..."
    }
  }
}
```

---

## Data Source 2: Dynamic State (State Machine)

**Use case:** Complex state management, multiple consumers

```tsx
import { Card } from '@gravityai-dev/design-system';
import { useSelector } from 'react-redux';

function CardsDisplay() {
  // Read from state machine
  const cards = useSelector(state => state.cards);

  return (
    <>
      {cards.map((card) => (
        <Card
          key={card.id}
          stateData={{
            title: card.title,
            description: card.description,
            imageUrl: card.imageUrl
          }}
          apiUrl="http://localhost:4000"
        />
      ))}
    </>
  );
}
```

---

## Data Source 3: Local DB (Cached, Super Fast)

**Use case:** Saved pages, archived content, offline support

```tsx
import { Card } from '@gravityai-dev/design-system';

function SavedCards() {
  return (
    <>
      {/* Fetches from local DB or API by ID */}
      <Card 
        cardId="card-123" 
        apiUrl="http://localhost:4000"
      />
      <Card 
        cardId="card-456" 
        apiUrl="http://localhost:4000"
      />
    </>
  );
}
```

**Server endpoint:**
```
GET /api/cards/card-123
→ Returns: { title: "...", description: "...", imageUrl: "..." }
```

---

## Template Caching

**Component templates are cached forever (versioned):**

```
First request:
  Client → GET /api/components/Card
  Server → { type: "Card", version: "1.0.0", html: "...", css: "..." }
  Client → Caches in memory + localStorage

Subsequent requests:
  Client → Uses cached template (instant)
  No network request needed!
```

---

## Styling with Design Tokens

**Override tokens per component or globally:**

```tsx
// Per component
<Card
  component={componentSpec}
  theme={{
    '--gravity-card-bg': '#f0f0f0',
    '--gravity-card-border': '#d0d0d0',
    '--gravity-color-primary': '#ff6b6b'
  }}
/>

// Global theme
<DesignSystemProvider
  theme={{
    '--gravity-color-primary': '#10b981',
    '--gravity-font-heading': 'Inter, sans-serif'
  }}
>
  <Card component={componentSpec} />
</DesignSystemProvider>
```

---

## Server-Side Template Structure

**Templates stored on server:**

```json
{
  "type": "Card",
  "version": "1.0.0",
  "html": "<div class='gravity-card-wrapper'>...</div>",
  "css": ".gravity-card-wrapper { ... }",
  "metadata": {
    "description": "Card component",
    "author": "Gravity AI"
  }
}
```

**Template interpolation:**
```html
<h3>{{title}}</h3>
<p>{{description}}</p>
<img src="{{imageUrl}}" />
```

---

## Complete Example: All 3 Sources

```tsx
import { Card } from '@gravityai-dev/design-system';
import { useSubscription } from '@apollo/client';
import { useSelector } from 'react-redux';

function DashboardPage() {
  // Source 1: Streaming
  const { data: liveData } = useSubscription(AI_RESULT);
  
  // Source 2: State
  const savedCards = useSelector(state => state.cards);
  
  return (
    <div className="dashboard">
      {/* Live streaming cards */}
      <section>
        <h2>Live Updates</h2>
        {liveData?.cards?.map(card => (
          <Card key={card.id} component={card.component} />
        ))}
      </section>
      
      {/* State machine cards */}
      <section>
        <h2>Current Session</h2>
        {savedCards.map(card => (
          <Card key={card.id} stateData={card} />
        ))}
      </section>
      
      {/* Cached cards from DB */}
      <section>
        <h2>Saved Cards</h2>
        <Card cardId="card-123" />
        <Card cardId="card-456" />
      </section>
    </div>
  );
}
```

---

## Benefits

✅ **Server-controlled templates** - Update styling without rebuild  
✅ **Flexible data sources** - Stream, state, or DB  
✅ **Performance** - Templates cached forever  
✅ **Offline support** - Local DB for cached content  
✅ **Dynamic theming** - Override tokens at runtime  
✅ **Type-safe** - Full TypeScript support  

---

## Server Endpoints Required

```
GET /api/components/:componentType
→ Returns component template (HTML/CSS)
→ Cache: Forever (versioned)

GET /api/cards/:cardId
→ Returns card data (title, description, etc.)
→ Cache: 1 hour or as needed

GraphQL Subscription: aiResult
→ Streams ComponentSpec in real-time
→ No caching (live data)
```
