"use client";

import { useState } from "react";
import { Translations, useLocale } from "@/context/LocaleContext";

// Add translations for this component
const translations: Translations = {
  en: {
    "urlInput.placeholder": "Paste YouTube video URL here",
    "urlInput.button": "Extract Recipe",
    "urlInput.processing": "Processing...",
    // Add other translations
  },
  ko: {
    "urlInput.placeholder": "유튜브 영상 URL을 여기에 붙여넣으세요",
    "urlInput.button": "레시피 추출하기",
    "urlInput.processing": "처리 중...",
    // Add other translations
  },
};

interface UrlInputFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export default function UrlInputForm({
  onSubmit,
  isLoading,
}: UrlInputFormProps) {
  const [url, setUrl] = useState("");
  const { locale } = useLocale();

  // Get component-specific translations
  const t2 = (key: string): string => {
    return translations[locale][key] || key;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder={t2("urlInput.placeholder")}
        className="p-3 ring-2 ring-tan rounded-lg w-full focus:outline-none focus:ring-terracotta transition-all text-black text-sm"
        required
      />
      <button
        type="submit"
        disabled={isLoading || !url.trim()}
        className="bg-terracotta hover:brightness-90 text-white py-2 px-4 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-default disabled:hover:brightness-100 transition-all"
      >
        {isLoading ? t2("urlInput.processing") : t2("urlInput.button")}
      </button>
    </form>
  );
}
