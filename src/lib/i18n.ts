
import 'server-only';
import { cookies } from 'next/headers';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import pa from '@/locales/pa.json';

type Language = 'en' | 'hi' | 'pa';

const translations: Record<string, any> = { en, hi, pa };

// This server-side function can be used in Server Components to get translations
export const getTranslations = async () => {
    const cookieStore = cookies();
    const langCookie = cookieStore.get('language');
    const language: Language = (langCookie?.value as Language) || 'en';
    
    const t = (key: string): string => {
        return translations[language]?.[key] || key;
    };

    return { t, language };
};
