'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Locale = 'en' | 'ko';

interface LocaleContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
}

export type TranslationDictionary = {
    [key: string]: string;
};

export type Translations = {
    [key in Locale]: TranslationDictionary;
};

const translations: Translations = {
    en: {
        'app.title': 'Youtube recipe extractor',
        'app.description.1': 'Extract nicely formatted recipes from cooking videos with a single click!',
        'app.description.2': 'Works best with videos that clearly demonstrate recipes step by step.',
        'app.madeBy': 'Made by',
        'error.title': 'Something went wrong!',
        'error.url': 'URL:',
        // Add more translations as needed
    },
    ko: {
        'app.title': '유튜브 레시피 추출기',
        'app.description.1': '한 번의 클릭으로 요리 영상에서 깔끔하게 정리된 레시피를 추출하세요!',
        'app.description.2': '레시피를 단계별로 명확하게 보여주는 영상에서 가장 잘 작동합니다.',
        'app.madeBy': '제작자:',
        'error.title': '문제가 발생했습니다!',
        'error.url': '링크:',
        // Add more translations as needed
    }
};

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<Locale>('en');

    const t = (key: string): string => {
        return translations[locale][key] || key;
    };

    return (
        <LocaleContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    const context = useContext(LocaleContext);
    if (!context) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
}