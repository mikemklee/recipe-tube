"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { translations } from "./translations";

type Locale = "en" | "ko";

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

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

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
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
