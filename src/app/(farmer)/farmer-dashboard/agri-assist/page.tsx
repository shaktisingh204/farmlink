'use client';

import { Chatbot } from '@/components/chatbot';
import { PageHeader } from '@/components/page-header';
import { getAgriAssistResponse } from './actions';
import { Bot } from 'lucide-react';

export default function AgriAssistPage() {
  return (
    <div className="space-y-8 h-[calc(100vh_-_10rem)] flex flex-col">
      <PageHeader
        title="Agri-Assistant"
        description="Your AI-powered expert for all farming questions. Ask about crop diseases, market trends, or best practices."
      />
      <div className="flex-1 min-h-0">
        <Chatbot
          chatbotName="Agri-Assistant"
          chatbotIcon={<Bot />}
          getAiResponse={getAgriAssistResponse}
          placeholder="Ask a question about your crops..."
        />
      </div>
    </div>
  );
}
