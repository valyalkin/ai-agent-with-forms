'use client';

import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ChatMessage, Interrupt, InputField, LocalMessage } from '@/app/lib/types/chat';
import { sendChatMessage, resumeWithField } from '@/app/lib/chat-api';
import { Message } from './message';
import { FieldInput } from './field-input';
import { LoadingIndicator } from './loading-indicator';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export function ChatContainer() {
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
  const [input, setInput] = useState('');
  const [interrupt, setInterrupt] = useState<Interrupt | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate session ID only on client side after hydration
  useEffect(() => {
    setSessionId(uuidv4());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages, interrupt, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading || interrupt || !sessionId) {
      return;
    }

    const userMessage = input.trim();

    // Add user message to local history immediately
    const userLocalMessage: LocalMessage = {
      id: uuidv4(),
      type: 'user',
      content: userMessage,
      timestamp: Date.now(),
    };
    setLocalMessages((prev) => [...prev, userLocalMessage]);

    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage({
        query: userMessage,
        session_id: sessionId,
      });

      setMessages(response.messages);

      if (response.__interrupt__ && response.__interrupt__.length > 0) {
        const interruptData = response.__interrupt__[0];
        setInterrupt(interruptData);

        // Add interrupt question as AI message to local history
        const aiLocalMessage: LocalMessage = {
          id: uuidv4(),
          type: 'ai',
          content: interruptData.value.field.description,
          timestamp: Date.now(),
        };
        setLocalMessages((prev) => [...prev, aiLocalMessage]);
      } else {
        setInterrupt(null);

        // Find the last AI message in the response and add it to local history
        const aiMessages = response.messages.filter((msg) => msg.type === 'ai' && msg.content);
        if (aiMessages.length > 0) {
          const lastAiMessage = aiMessages[aiMessages.length - 1];
          const aiLocalMessage: LocalMessage = {
            id: uuidv4(),
            type: 'ai',
            content: lastAiMessage.content,
            timestamp: Date.now(),
          };
          setLocalMessages((prev) => [...prev, aiLocalMessage]);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldSubmit = async (inputField: InputField) => {
    if (!interrupt || isLoading || !sessionId) {
      return;
    }

    // Format the field value for display
    let displayValue = '';
    switch (inputField.type) {
      case 'text':
        displayValue = inputField.value;
        break;
      case 'number':
        displayValue = inputField.value.toString();
        break;
      case 'date':
        displayValue = inputField.value;
        break;
      case 'checkbox':
        displayValue = inputField.values.join(', ');
        break;
      case 'radio':
        displayValue = inputField.value;
        break;
    }

    // Add form response to local history as greyed-out message
    const formResponseMessage: LocalMessage = {
      id: uuidv4(),
      type: 'form-response',
      content: displayValue,
      timestamp: Date.now(),
    };
    setLocalMessages((prev) => [...prev, formResponseMessage]);

    // Remove the form immediately and show loading indicator
    setInterrupt(null);
    setIsLoading(true);

    try {
      const response = await resumeWithField({
        field: inputField,
        session_id: sessionId,
      });

      setMessages(response.messages);

      if (response.__interrupt__ && response.__interrupt__.length > 0) {
        const interruptData = response.__interrupt__[0];
        setInterrupt(interruptData);

        // Add next interrupt question as AI message
        const aiLocalMessage: LocalMessage = {
          id: uuidv4(),
          type: 'ai',
          content: interruptData.value.field.description,
          timestamp: Date.now(),
        };
        setLocalMessages((prev) => [...prev, aiLocalMessage]);
      } else {
        setInterrupt(null);

        // Find the last AI message in the response and add it to local history
        const aiMessages = response.messages.filter((msg) => msg.type === 'ai' && msg.content);
        if (aiMessages.length > 0) {
          const lastAiMessage = aiMessages[aiMessages.length - 1];
          const aiLocalMessage: LocalMessage = {
            id: uuidv4(),
            type: 'ai',
            content: lastAiMessage.content,
            timestamp: Date.now(),
          };
          setLocalMessages((prev) => [...prev, aiLocalMessage]);
        }
      }
    } catch (error) {
      console.error('Failed to submit field:', error);
      alert('Failed to submit field. Please try again.');
      // Don't restore interrupt on error - user will need to retry by refreshing
    } finally {
      setIsLoading(false);
    }
  };

  const hasInterrupt = interrupt !== null;

  return (
    <div className="flex h-[calc(100vh-200px)] flex-col rounded-lg border border-gray-300 bg-white shadow-sm">
      {/* Session ID Header */}
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <div className="text-xs text-gray-500">
          Session ID: <span className="font-mono font-medium">{sessionId || 'Loading...'}</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {localMessages.length === 0 && (
          <div className="flex h-full items-center justify-center text-gray-400">
            Start a conversation with the AI agent
          </div>
        )}

        {/* Display local messages only */}
        {localMessages.map((msg) => (
          <div
            key={msg.id}
            className={clsx('mb-4 flex', {
              'justify-end': msg.type === 'user' || msg.type === 'form-response',
              'justify-start': msg.type === 'ai',
            })}
          >
            <div
              className={clsx('max-w-[80%] rounded-lg px-4 py-2 text-sm', {
                'bg-blue-600 text-white': msg.type === 'user',
                'bg-gray-200 text-gray-900': msg.type === 'ai',
                'bg-gray-300 text-gray-600 italic': msg.type === 'form-response',
              })}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && <LoadingIndicator />}

        {/* Interrupt Field */}
        {interrupt && !isLoading && (
          <div className="mt-4">
            <FieldInput
              field={interrupt.value.field}
              onSubmit={handleFieldSubmit}
              disabled={isLoading}
            />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-gray-50 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading || hasInterrupt || !sessionId}
            placeholder={
              !sessionId
                ? 'Initializing session...'
                : hasInterrupt
                ? 'Please complete the form above before sending a message'
                : 'Type your message...'
            }
            className={clsx(
              'flex-1 rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2',
              {
                'border-gray-300 bg-white focus:ring-blue-500': !hasInterrupt && sessionId,
                'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400': hasInterrupt || !sessionId,
              }
            )}
          />
          <button
            type="submit"
            disabled={isLoading || hasInterrupt || !input.trim() || !sessionId}
            className={clsx(
              'flex items-center justify-center rounded-md px-4 py-2 text-white transition-colors',
              {
                'bg-blue-600 hover:bg-blue-700': !hasInterrupt && !isLoading && input.trim() && sessionId,
                'cursor-not-allowed bg-gray-300': hasInterrupt || isLoading || !input.trim() || !sessionId,
              }
            )}
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
