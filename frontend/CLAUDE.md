# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
pnpm dev              # Start development server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server
```

## High-Level Architecture

This is a Next.js 15+ chat application demonstrating modern App Router patterns with AI agent integration.

### Application Overview

A simple AI chat interface that connects to an external agent API, supporting:
- Multi-turn conversations with session management
- Structured field interrupts (agent can request specific user inputs)
- Dynamic form generation for 5 field types
- Message history with typing indicators

### File Structure

```
app/
├── chat/
│   └── page.tsx              # Chat route (main page)
├── ui/
│   └── chat/
│       ├── chat-container.tsx    # Main chat component with state management
│       ├── chat-window.tsx       # Alternative standalone chat implementation
│       ├── message.tsx           # Message display component
│       ├── field-input.tsx       # Dynamic form field renderer
│       ├── loading-indicator.tsx # Loading spinner
│       └── datepicker-custom.css # Date picker styling
├── lib/
│   ├── chat-api.ts           # API client functions
│   └── types/
│       └── chat.ts           # TypeScript type definitions
├── layout.tsx                # Root layout
└── page.tsx                  # Root page (redirects to /chat)
```

### Architecture Layers

**1. Presentation Layer** (`app/ui/chat/`)
- `ChatContainer` - Main client component managing chat state
- `Message` - Renders individual messages (human, AI, tool)
- `FieldInput` - Dynamic form field component supporting 5 field types
- `LoadingIndicator` - Shows during agent processing

**2. API Layer** (`app/lib/chat-api.ts`)
- `sendChatMessage()` - Sends user message to agent API
- `resumeWithField()` - Submits field responses to resume agent

**3. Type Layer** (`app/lib/types/chat.ts`)
- Message types: `HumanMessage`, `AIMessage`, `ToolMessage`
- Field types: `TextField`, `NumberField`, `DateField`, `CheckboxField`, `RadioField`
- API types: `ChatInput`, `ChatResponse`, `ChatFieldInput`

### Data Flow

**Starting a Conversation:**
```
User Input → sendChatMessage({ message, session_id }) → External API → ChatResponse → Update UI
```

**Handling Agent Interrupts:**
```
Agent requests field → Render FieldInput → User submits → resumeWithField({ session_id, interrupt_id, field_id, value }) → Agent resumes → ChatResponse
```

**Session Management:**
- Each conversation has a unique `session_id` (UUID)
- Generated on first message using `uuidv4()`
- Persisted throughout conversation for continuity
- Sent with every API request

### Key Components

**ChatContainer** (`app/ui/chat/chat-container.tsx`)
- Manages conversation state with `useState`
- Handles message sending and field submission
- Displays message history
- Renders field forms when agent interrupts
- Client component (`'use client'`)

**FieldInput** (`app/ui/chat/field-input.tsx`)
- Dynamic form field renderer
- Supports 5 field types:
  - `text` - Text input
  - `number` - Number input with optional min/max
  - `date` - Date picker using `react-datepicker`
  - `checkbox` - Boolean checkbox
  - `radio` - Radio button group with options
- Validates required fields
- Calls submit callback on form submission

**Message** (`app/ui/chat/message.tsx`)
- Displays different message types with distinct styling
- Shows sender name and content
- Handles tool messages with special formatting

### API Integration

**Base URL:**
Configured via `NEXT_PUBLIC_API_BASE_URL` environment variable

**Endpoints:**
- `POST /agent/simple/chat` - Send chat message
- `POST /agent/simple/chat/resume/field` - Resume with field value

**Request/Response Format:**
```typescript
// Chat request
{
  message: string;
  session_id: string;
}

// Field resume request
{
  session_id: string;
  interrupt_id: string;
  field_id: string;
  value: any;
}

// Chat response
{
  message: string;
  interrupted: boolean;
  interrupt_id?: string;
  fields?: Field[];
  additional_messages?: Message[];
}
```

### TypeScript Types

All types defined in `app/lib/types/chat.ts`:

**Core Types:**
- `Message` - Union of HumanMessage | AIMessage | ToolMessage
- `Field` - Union of TextField | NumberField | DateField | CheckboxField | RadioField
- `ChatResponse` - API response structure
- `ChatInput` - API request structure

**Field Types:**
Each field type has:
- `id` - Unique field identifier
- `label` - Display label
- `required` - Whether field is required
- `type` - Field type discriminator
- Type-specific properties (e.g., `options` for RadioField)

### Styling

- **Framework:** Tailwind CSS utility classes
- **Responsive:** Mobile-first design
- **Custom CSS:** Only for date picker (`datepicker-custom.css`)
- **Icons:** From `@heroicons/react/24/outline`
- **Class Management:** Uses `clsx` for conditional classes

### Environment Variables

```bash
NEXT_PUBLIC_API_BASE_URL    # External agent API base URL (e.g., https://api.example.com)
```

### Important Patterns

**State Management:**
- Local React state with `useState`
- No external state library needed
- Messages stored in array
- Session ID generated once and reused

**Error Handling:**
- API errors logged to console
- User-friendly error messages displayed
- Failed requests don't crash the app

**Forms:**
- Controlled components
- Client-side validation for required fields
- Submission prevents default behavior
- Loading states during API calls

**Imports:**
- Use path alias: `@/app/lib/chat-api` (not `../lib/chat-api`)
- Configured in `tsconfig.json`: `"@/*": ["./*"]`

### Dependencies

```json
{
  "@heroicons/react": "^2.2.0",        // Icons
  "@tailwindcss/forms": "^0.5.10",     // Form styling
  "next": "latest",                     // Framework
  "react": "latest",                    // UI library
  "react-datepicker": "^8.8.0",        // Date picker
  "uuid": "^13.0.0",                    // Session ID generation
  "clsx": "^2.1.1",                     // Class utilities
  "tailwindcss": "3.4.17"               // Styling
}
```

### Development Workflow

1. **Start dev server:** `pnpm dev`
2. **Navigate to:** `http://localhost:3000` (redirects to `/chat`)
3. **Test chat:** Enter messages and interact with agent
4. **Test fields:** When agent requests fields, fill and submit forms
5. **Build for production:** `pnpm build`
6. **Run production:** `pnpm start`

### Extending the Application

**Adding New Field Types:**
1. Define type in `app/lib/types/chat.ts`
2. Add case to `FieldInput` component
3. Update API documentation

**Customizing Styling:**
1. Modify Tailwind classes in components
2. Add custom CSS to `datepicker-custom.css` if needed
3. Update responsive breakpoints as needed

**Changing API:**
1. Update `NEXT_PUBLIC_API_BASE_URL` environment variable
2. Modify API functions in `app/lib/chat-api.ts`
3. Update types in `app/lib/types/chat.ts` if API contract changes
