"use client";

import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { FaWandMagicSparkles } from "react-icons/fa6";

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
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <h3 className="text-md font-semibold text-black mb-2 flex items-center gap-2">
          <FaWandMagicSparkles />
          {t("urlInput.title")}
        </h3>
        <div className="flex gap-4 items-stretch">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t("urlInput.placeholder")}
            className=" px-3 py-2 ring-2 ring-tan rounded-lg flex-grow focus:outline-none focus:ring-terracotta transition-all text-black text-sm"
            required
          />
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="w-28 font-bold bg-terracotta hover:brightness-90 text-white  px-3 py-2 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-default disabled:hover:brightness-100 transition-all ring-2 ring-terracotta"
          >
            {isLoading ? t("urlInput.processing") : t("urlInput.button")}
          </button>
        </div>
      </form>
    </div>
  );
}
