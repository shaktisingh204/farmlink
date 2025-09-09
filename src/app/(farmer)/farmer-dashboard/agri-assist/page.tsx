
'use client';

import { Chatbot } from '@/components/chatbot';
import { PageHeader } from '@/components/page-header';
import { getAgriAssistResponse } from './actions';
import { Bot } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export default function AgriAssistPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-8 h-[calc(100vh_-_10rem)] flex flex-col">
      <PageHeader
        title={t('agriAssistant')}
        description={t('agriAssistantDesc')}
      />
      <div className="flex-1 min-h-0">
        <Chatbot
          chatbotName={t('agriAssistant')}
          chatbotIcon={<Bot />}
          getAiResponse={getAgriAssistResponse}
          placeholder={t('askAboutCrops')}
          initialMessage={t('agriAssistantInitialMessage')}
        />
      </div>
    </div>
  );
}
