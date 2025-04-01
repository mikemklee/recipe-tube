"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "@/context/LocaleContext";

interface ApiKeyInputProps {
  onSave: (apiKey: string) => void;
  initialKey?: string;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({
  onSave,
  initialKey = "",
}) => {
  const { t } = useLocale();
  const [apiKey, setApiKey] = useState(initialKey);
  const [saved, setSaved] = useState(!!initialKey);

  useEffect(() => {
    // Load API key from localStorage on component mount
    const storedKey = localStorage.getItem("geminiApiKey");
    if (storedKey) {
      setApiKey(storedKey);
      setSaved(true);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      // Save to localStorage
      localStorage.setItem("geminiApiKey", apiKey);
      onSave(apiKey);
      setSaved(true);
    }
  };

  const handleClear = () => {
    localStorage.removeItem("geminiApiKey");
    setApiKey("");
    setSaved(false);
    onSave("");
  };

  return (
    <div className="mb-6 p-4 border border-tan rounded-lg bg-beige shadow-sm">
      <h3 className="text-lg font-semibold text-black mb-2">
        {t("apiKey.title")}
      </h3>
      <p className="text-gray-600 text-sm mb-3">{t("apiKey.description")}</p>

      <div className="flex gap-2">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
            setSaved(false);
          }}
          placeholder={t("apiKey.placeholder")}
          className="flex-1 p-2 border border-gray-300 rounded-md text-black"
        />
        <button
          onClick={handleSave}
          disabled={!apiKey.trim() || saved}
          className="bg-terracotta text-white px-4 py-2 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {saved ? t("apiKey.saved") : t("apiKey.save")}
        </button>
        {saved && (
          <button
            onClick={handleClear}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            {t("apiKey.clear")}
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2">{t("apiKey.securityNote")}</p>
    </div>
  );
};

export default ApiKeyInput;
