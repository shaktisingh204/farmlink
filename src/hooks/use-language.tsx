
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from 'lucide-react';

import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import pa from '@/locales/pa.json';

const translations: Record<string, any> = { en, hi, pa };

type Language = 'en' | 'hi' | 'pa';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// This server-side function can be used in Server Components to get translations
export const getTranslations = async () => {
    // Dynamically import 'next/headers' only on the server
    const { cookies } = await import('next/headers');
    const cookieStore = cookies();
    const langCookie = cookieStore.get('language');
    const language: Language = (langCookie?.value as Language) || 'en';
    const t = (key: string): string => {
        return translations[language]?.[key] || key;
    };
    return { t, language };
};


export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'hi', 'pa'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
      document.cookie = `language=${savedLanguage};path=/;max-age=31536000`;
    } else {
      document.cookie = `language=en;path=/;max-age=31536000`;
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.cookie = `language=${lang};path=/;max-age=31536000`;
     // We can reload to ensure server components also re-render with the new language
    window.location.reload();
  };

  const t = useCallback((key: string): string => {
    return translations[language]?.[key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();

    return (
        <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
             <Select onValueChange={(value: Language) => setLanguage(value)} value={language}>
                <SelectTrigger className="w-[120px] h-8 border-none bg-transparent text-muted-foreground hover:text-foreground">
                    <SelectValue placeholder={t('languageSwitcher_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिन्दी</SelectItem>
                    <SelectItem value="pa">ਪੰਜਾਬੀ</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
