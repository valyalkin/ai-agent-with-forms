import { ChatContainer } from '@/app/ui/chat/chat-container';

export default function ChatPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">AI Agent Chat</h1>
      <ChatContainer />
    </div>
  );
}
