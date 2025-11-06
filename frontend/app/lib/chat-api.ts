import type { ChatInput, ChatFieldInput, ChatResponse } from './types/chat';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function sendChatMessage(input: ChatInput): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/agent/simple/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Failed to send chat message: ${response.statusText}`);
  }

  return response.json();
}

export async function resumeWithField(input: ChatFieldInput): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/agent/simple/chat/resume/field`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Failed to resume chat: ${response.statusText}`);
  }

  return response.json();
}
