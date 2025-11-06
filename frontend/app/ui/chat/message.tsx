'use client';

import type { ChatMessage } from '@/app/lib/types/chat';
import clsx from 'clsx';

interface MessageProps {
  message: ChatMessage;
}

export function Message({ message }: MessageProps) {
  if (message.type === 'tool') {
    // Don't render tool messages
    return null;
  }

  const isAI = message.type === 'ai';
  const isHuman = message.type === 'human';

  // Skip AI messages with no content (these are typically tool-calling messages)
  if (isAI && !message.content) {
    return null;
  }

  return (
    <div
      className={clsx('mb-4 flex', {
        'justify-end': isHuman,
        'justify-start': isAI,
      })}
    >
      <div
        className={clsx('max-w-[80%] rounded-lg px-4 py-2 text-sm', {
          'bg-blue-600 text-white': isHuman,
          'bg-gray-200 text-gray-900': isAI,
        })}
      >
        {message.content}
      </div>
    </div>
  );
}
