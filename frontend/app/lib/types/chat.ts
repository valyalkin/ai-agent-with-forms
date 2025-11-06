// Chat API types
export type MessageType = 'human' | 'ai' | 'tool';

export interface BaseMessage {
  content: string;
  type: MessageType;
  id: string;
  name: string | null;
}

export interface HumanMessage extends BaseMessage {
  type: 'human';
  additional_kwargs: Record<string, unknown>;
  response_metadata: Record<string, unknown>;
}

export interface ToolCall {
  name: string;
  args: Record<string, unknown>;
  id: string;
  type: 'tool_call';
}

export interface AIMessage extends BaseMessage {
  type: 'ai';
  additional_kwargs: {
    refusal: string | null;
  };
  response_metadata: Record<string, unknown>;
  tool_calls: ToolCall[];
  invalid_tool_calls: unknown[];
  usage_metadata?: Record<string, unknown>;
}

export interface ToolMessage extends BaseMessage {
  type: 'tool';
  tool_call_id: string;
  artifact: unknown | null;
  status: string;
  additional_kwargs: Record<string, unknown>;
  response_metadata: Record<string, unknown>;
}

export type ChatMessage = HumanMessage | AIMessage | ToolMessage;

// Field types
export type FieldType = 'text' | 'number' | 'date' | 'checkbox' | 'radio';

export interface BaseField {
  id: string;
  type: FieldType;
  description: string;
}

export interface TextField extends BaseField {
  type: 'text';
  placeholder: string;
  max_length: number;
}

export interface NumberField extends BaseField {
  type: 'number';
}

export interface DateField extends BaseField {
  type: 'date';
}

export interface CheckboxField extends BaseField {
  type: 'checkbox';
  options: string[];
}

export interface RadioField extends BaseField {
  type: 'radio';
  options: string[];
}

export type Field = TextField | NumberField | DateField | CheckboxField | RadioField;

// Interrupt types
export interface FieldInputRequest {
  id: string;
  type: 'field';
  field: Field;
}

export interface Interrupt {
  value: FieldInputRequest;
  id: string;
}

// API Response
export interface ChatResponse {
  messages: ChatMessage[];
  __interrupt__?: Interrupt[];
}

// API Request types
export interface ChatInput {
  query: string;
  session_id: string;
}

// Input field value types
export interface BaseInputField {
  id: string;
  type: FieldType;
}

export interface TextInputField extends BaseInputField {
  type: 'text';
  value: string;
}

export interface NumberInputField extends BaseInputField {
  type: 'number';
  value: number;
}

export interface DateInputField extends BaseInputField {
  type: 'date';
  value: string; // ISO date string
}

export interface CheckboxInputField extends BaseInputField {
  type: 'checkbox';
  values: string[];
}

export interface RadioInputField extends BaseInputField {
  type: 'radio';
  value: string;
}

export type InputField = TextInputField | NumberInputField | DateInputField | CheckboxInputField | RadioInputField;

export interface ChatFieldInput {
  field: InputField;
  session_id: string;
}

// Local display message types for UI
export interface LocalMessage {
  id: string;
  type: 'user' | 'ai' | 'form-response';
  content: string;
  timestamp: number;
}
