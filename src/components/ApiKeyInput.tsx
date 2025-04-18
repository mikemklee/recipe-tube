"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "@/context/LocaleContext";
import { motion } from "framer-motion";
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
    // Load API key from localStorage on component mount
    const storedKey = localStorage.getItem("geminiApiKey");
    if (storedKey) {
      setApiKey(storedKey);
      setOriginalKey(storedKey);
      setSaved(true);
      setIsCollapsed(true);
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

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <motion.div
      className="rounded-xl shadow-xl w-full border-2 border-tan p-6 mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }} // Adjusted delay slightly
    >
      <div>
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
          <span className="text-gray-600 text-xl">
            {isCollapsed ? <RiArrowDownSLine /> : <RiArrowUpSLine />}
          </span>
        </div>

        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4"
          >
            <p className="text-gray-600 text-sm mb-3">
              {t("apiKey.description")}
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
            <p className="text-xs text-gray-500 mt-3">
              {t("apiKey.securityNote")}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ApiKeyInput;
