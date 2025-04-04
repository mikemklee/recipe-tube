"use client";
import React, { useState } from "react";
import { Recipe, ApiError } from "@/types";
import UrlInputForm from "@/components/UrlInputForm";
import RecipeDisplay from "@/components/RecipeDisplay";
import LoadingSpinner from "@/components/LoadingSpinner";
import ApiKeyInput from "@/components/ApiKeyInput";
import { motion } from "framer-motion";
import { MdBookmarks } from "react-icons/md";

import { LocaleProvider, useLocale } from "@/context/LocaleContext";

function MainContent() {
  const { locale, setLocale, t } = useLocale();
  const [recipe, setRecipe] = useState<Recipe | null>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");
  const [geminiApiKey, setGeminiApiKey] = useState<string | null>(null);

  const handleApiKeySave = (apiKey: string) => {
    setGeminiApiKey(apiKey);
  };

  const handleExtractRecipe = async (youtubeUrl: string) => {
    setIsLoading(true);
    setError(null);
    setRecipe(null);
    setUrl(youtubeUrl);

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/extract-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          locale,
          apiKey: geminiApiKey, // Include the API key in the request
        }),
      });

      const data: Recipe | ApiError = await response.json();

      if (!response.ok) {
        throw new Error(
          (data as ApiError).message ||
            `Request failed with status ${response.status}`
        );
      }

      if ("ingredients" in data && "instructions" in data) {
        setRecipe(data);
        console.log(JSON.stringify(data, null, 2));
      } else {
        throw new Error(
          (data as ApiError).message ||
            "Received unexpected data format from API."
        );
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <div className="min-h-screen bg-cream">
        <div className="container mx-auto px-4 py-12 max-w-[40rem]">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-semibold text-black mb-3">
                {t("app.title")}
                <MdBookmarks className="inline-block text-terracotta ml-2 mb-1" />
              </h1>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setLocale(locale === "en" ? "ko" : "en")}
                  className="px-2 py-1 text-sm bg-terracotta opacity-60 hover:opacity-100 text-white rounded-md transition-all flex items-center cursor-pointer"
                >
                  {locale === "en" ? "한국어로" : "To English"}
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-700 border-l-2 pl-2 border-tan italic mb-2 flex flex-col">
              <span>{t("app.description.1")}</span>
              <span>{t("app.description.2")}</span>

              <span className="text-sm mt-2">
                {t("app.madeBy")}
                <a
                  href="https://github.com/mikemklee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline pl-0.5 w-min text-terracotta"
                >
                  @mikemklee
                </a>
              </span>
            </div>
          </div>

          {error && (
            <motion.div
              className="w-full mt-6 p-6 border-2 border-orange-300 rounded-xl shadow-md bg-orange-100 mb-8 text-orange-800 flex flex-col gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-bold">{t("error.title")}</p>
              <p>{error}</p>
              {url && (
                <p className="text-sm font-medium">
                  {t("error.url")} {url}
                </p>
              )}
            </motion.div>
          )}

          <motion.div
            className="rounded-xl shadow-xl w-full border-2 border-tan p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ApiKeyInput onSave={handleApiKeySave} />

            <hr className="border-1 border-tan mb-4 opacity-50" />

            <UrlInputForm
              onSubmit={handleExtractRecipe}
              isLoading={isLoading}
            />
          </motion.div>

          {recipe && !isLoading && (
            <motion.div
              className="w-full mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <RecipeDisplay recipe={recipe} />
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              className="my-12 flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <LoadingSpinner />
            </motion.div>
          )}
        </div>
      </div>

      {/* Add the API Key Input */}
    </main>
  );
}

// Main component that provides the locale context
export default function Home() {
  return (
    <LocaleProvider>
      <MainContent />
    </LocaleProvider>
  );
}
