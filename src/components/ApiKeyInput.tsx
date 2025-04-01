"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "@/context/LocaleContext";
import { RiGeminiLine } from "react-icons/ri";

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
  const [originalKey, setOriginalKey] = useState(initialKey);
  const [saved, setSaved] = useState(!!initialKey);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load API key from localStorage on component mount
    const storedKey = localStorage.getItem("geminiApiKey");
    if (storedKey) {
      setApiKey(storedKey);
      setOriginalKey(storedKey);
      setSaved(true);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      // Save to localStorage
      localStorage.setItem("geminiApiKey", apiKey);
      onSave(apiKey);
      setOriginalKey(apiKey);
      setSaved(true);
      setIsEditing(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem("geminiApiKey");
    setApiKey("");
    setOriginalKey("");
    setSaved(false);
    setIsEditing(false);
    onSave("");
  };

  // Detect if user is editing the saved key
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setApiKey(newValue);

    if (saved && newValue !== originalKey) {
      setIsEditing(true);
    } else if (newValue === originalKey) {
      setIsEditing(false);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-md font-semibold text-black mb-2 flex items-center gap-2">
        {t("apiKey.title")}
        <RiGeminiLine />
      </h3>
      <p className="text-gray-600 text-sm mb-3">{t("apiKey.description")}</p>

      <div className="flex flex-col gap-3">
        <div className="flex gap-4 items-stretch">
          <input
            value={apiKey}
            onChange={handleInputChange}
            placeholder={t("apiKey.placeholder")}
            className="px-3 py-2 ring-2 ring-tan rounded-lg flex-grow focus:outline-none focus:ring-terracotta transition-all text-black text-sm"
          />
          {isEditing || !saved ? (
            <button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="w-28 font-bold bg-terracotta hover:brightness-90 text-white py-2 px-4 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-default disabled:hover:brightness-100 transition-all ring-2 ring-terracotta"
            >
              {t("apiKey.save")}
            </button>
          ) : (
            <button
              onClick={handleClear}
              className="w-36 font-bold hover:brightness-90 bg-neutral-500 text-white px-3 py-2 rounded-lg cursor-pointer transition-all ring-2 ring-neutral-500"
            >
              {t("apiKey.clear")}
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-3">{t("apiKey.securityNote")}</p>
    </div>
  );
};

export default ApiKeyInput;
