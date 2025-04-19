"use client";

import React, { useEffect, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { RiGeminiLine, RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";

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
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    setApiKey(initialKey);
    setOriginalKey(initialKey);
    setSaved(!!initialKey);
  }, [initialKey]);

  const handleSave = () => {
    if (apiKey.trim()) {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setApiKey(newValue);

    if (saved && newValue !== originalKey) {
      setIsEditing(true);
    } else if (newValue === originalKey) {
      setIsEditing(false);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className=" w-full my-4">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={toggleCollapse}
      >
        <h3 className="text-md font-semibold text-black flex items-center gap-2 flex-grow">
          <RiGeminiLine />
          {t("apiKey.title")}
          {!originalKey && (
            <span className="inline-flex items-center relative mb-3 ml-[-0.2rem]">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative rounded-full h-2 w-2 bg-amber-600"></span>
              </span>
            </span>
          )}
        </h3>
        <span className="text-gray-600 text-xl mr-2">
          {isCollapsed ? <RiArrowDownSLine /> : <RiArrowUpSLine />}
        </span>
      </div>

      {!isCollapsed && (
        <div className="mt-4">
          <p className="text-gray-600 text-xs">{t("apiKey.description")}</p>
          <p className="text-xs text-gray-600 my-1 mb-2">
            {t("apiKey.securityNote")}
          </p>

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
                  className="w-28 font-bold hover:brightness-90 bg-neutral-500 text-white px-3 py-2 rounded-lg cursor-pointer transition-all ring-2 ring-neutral-500"
                >
                  {t("apiKey.clear")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeyInput;
