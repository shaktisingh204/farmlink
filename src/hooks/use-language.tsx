
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
import { cn } from '@/lib/utils';

type Language = 'en' | 'hi' | 'pa';

const translations = { en, hi, pa };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedLang = localStorage.getItem('language') as Language;
    if (storedLang && translations[storedLang]) {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (isMounted) {
      localStorage.setItem('language', lang);
    }
  };

  const t = useCallback((key: string, options?: Record<string, string | number>): string => {
    let translation = translations[language][key as keyof typeof translations[Language]] || key;
    if (options) {
      Object.keys(options).forEach(optKey => {
        translation = translation.replace(`{{${optKey}}}`, String(options[optKey]));
      });
    }
    return translation;
  }, [language]);


  if (!isMounted) {
    return null;
  }
  
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

export function LanguageSwitcher({ className }: { className?: string}) {
  const { language, setLanguage } = useLanguage();

  return (
    <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
      <SelectTrigger className={cn("w-auto gap-2 border-0 bg-transparent shadow-none focus:ring-0 focus:ring-offset-0", className)}>
        <Globe className="h-4 w-4" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="hi">हिन्दी</SelectItem>
        <SelectItem value="pa">ਪੰਜਾਬੀ</SelectItem>
      </SelectContent>
    </Select>
  );
}
