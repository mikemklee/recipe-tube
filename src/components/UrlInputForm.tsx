"use client";

import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";

interface UrlInputFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export default function UrlInputForm({
  onSubmit,
  isLoading,
}: UrlInputFormProps) {
  const [url, setUrl] = useState("");
  const { t } = useLocale();

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
        placeholder={t("urlInput.placeholder")}
        className="p-3 ring-2 ring-terracotta rounded-lg w-full focus:outline-none focus:ring-terracotta transition-all text-black text-sm"
        required
      />
      <button
        type="submit"
        disabled={isLoading || !url.trim()}
        className="font-bold bg-terracotta hover:brightness-90 text-white py-2 px-4 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-default disabled:hover:brightness-100 transition-all"
      >
        {isLoading ? t("urlInput.processing") : t("urlInput.button")}
      </button>
    </form>
  );
}
