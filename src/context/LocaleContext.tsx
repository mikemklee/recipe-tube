"use client";

import { createContext, useContext, useState, ReactNode } from "react";

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

const translations: Translations = {
  en: {
    "app.title": "RecipeTube",
    "app.description.1":
      "Extract nicely formatted recipes from cooking videos with a single click!",
    "app.description.2":
      "Works best with videos that clearly demonstrate recipes step by step.",
    "app.madeBy": "Made by",
    "error.title": "Something went wrong!",
    "error.url": "URL:",
    "app.loading": "Extracting recipe... This may take a moment.",
    "recipe.ingredients": "Ingredients",
    "recipe.instructions": "Instructions",
    "recipe.extractedFrom": "Extracted from",
    "recipe.originalTitle": "Original Video",
    "recipe.prep": "Prep",
    "recipe.cook": "Cook",
    "recipe.total": "Total",
    "recipe.servings": "Servings",
  },
  ko: {
    "app.title": "RecipeTube",
    "app.description.1":
      "클릭 한번으로 유튜브 요리 영상에서 깔끔하게 정리된 레시피를 뽑아내세요!",
    "app.description.2":
      "레시피를 단계별로 명확하게 보여주는 영상에서 가장 잘 작동합니다.",
    "app.madeBy": "제작자",
    "error.title": "문제가 발생했습니다!",
    "error.url": "링크:",
    "app.loading": "레시피 추출 중... 잠시만 기다려주세요.",
    "recipe.ingredients": "재료",
    "recipe.instructions": "조리 방법",
    "recipe.extractedFrom": "출처",
    "recipe.originalTitle": "원본 비디오",
    "recipe.prep": "준비 시간",
    "recipe.cook": "조리 시간",
    "recipe.total": "총 소요 시간",
    "recipe.servings": "분량",
  },
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
