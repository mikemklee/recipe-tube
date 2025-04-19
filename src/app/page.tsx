"use client";
import React, { useState, useEffect } from "react";
import { Recipe, ApiError, SavedRecipe } from "@/types";
import SavedRecipesPanel from "@/components/SavedRecipesPanel";
import ExtractRecipePanel from "@/components/ExtractRecipePanel";
import { MdBookmarks } from "react-icons/md";
import { generateId } from "@/lib/utils";
import { RiGlobalLine } from "react-icons/ri";
import localFont from "next/font/local";
import { Aleo } from "next/font/google";

import { LocaleProvider, useLocale } from "@/context/LocaleContext";

export const myFont = localFont({
  src: "./NanumSquareNeo-Variable.woff2",
  display: "swap",
});

export const aleoFont = Aleo({
  subsets: ["latin"],
  display: "swap",
});

enum Tab {
  EXTRACT = "extract",
  SAVED = "saved",
}

function MainContent() {
  const { locale, setLocale, t } = useLocale();
  const [recipe, setRecipe] = useState<Recipe | null>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");
  const [geminiApiKey, setGeminiApiKey] = useState<string | undefined>();
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);

  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.EXTRACT);

  useEffect(() => {
    const storedKey = localStorage.getItem("geminiApiKey");
    if (storedKey) {
      setGeminiApiKey(storedKey);
    }

    const storedRecipes = localStorage.getItem("savedRecipes");
    if (storedRecipes) {
      try {
        setSavedRecipes(JSON.parse(storedRecipes));
      } catch (e) {
        console.error("Failed to parse saved recipes:", e);
      }
    }
  }, []);

  const handleSaveRecipe = () => {
    if (!recipe) return;

    const savedRecipe: SavedRecipe = {
      ...recipe,
      id: generateId(),
      savedAt: new Date().toISOString(),
    };

    const updatedRecipes = [...savedRecipes, savedRecipe];
    setSavedRecipes(updatedRecipes);
    localStorage.setItem("savedRecipes", JSON.stringify(updatedRecipes));
  };

  const handleDeleteRecipe = (id: string) => {
    const updatedRecipes = savedRecipes.filter((recipe) => recipe.id !== id);
    setSavedRecipes(updatedRecipes);
    localStorage.setItem("savedRecipes", JSON.stringify(updatedRecipes));
  };

  const isCurrentRecipeSaved = (): boolean => {
    if (!recipe) return false;
    return savedRecipes.some(
      (saved) =>
        saved.sourceUrl === recipe.sourceUrl && saved.title === recipe.title
    );
  };

  const handleExtractRecipe = async (youtubeUrl: string) => {
    setIsLoading(true);
    setError(null);
    setRecipe(null);
    setUrl(youtubeUrl);

    try {
      const response = await fetch("/api/extract-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: youtubeUrl,
          locale,
          apiKey: geminiApiKey,
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
      } else {
        throw new Error(
          (data as ApiError).message ||
            "Received unexpected data format from API."
        );
      }
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={locale === "ko" ? myFont.className : aleoFont.className}>
      <div className="min-h-screen bg-cream">
        <div className="container mx-auto px-4 py-8 max-w-[40rem]">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h1
                className={`text-2xl font-semibold text-black mb-3 ${aleoFont.className}`}
              >
                {t("app.title")}
                <MdBookmarks className="inline-block text-terracotta ml-2 mb-1" />
              </h1>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setLocale(locale === "en" ? "ko" : "en")}
                  className="px-2 py-1 text-sm opacity-80 hover:opacity-100 text-terracotta transition-all flex items-center cursor-pointer"
                >
                  <RiGlobalLine className="mr-1" />
                  {locale === "en" ? "한국어로" : "To English"}
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-700 border-l-2 pl-2 border-tan italic mb-2 flex flex-col">
              <span>{t("app.description.1")}</span>
              <span>{t("app.description.2")}</span>

              <span className="mt-2">
                {t("app.madeBy")}
                <a
                  href="https://github.com/mikemklee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline pl-0.5 w-min text-terracotta"
                >
                  @mikemklee
                </a>
              </span>
            </div>
          </div>

          <div className="flex border-b-2 border-tan/30">
            {Object.values(Tab).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`relative px-4 py-1 rounded-t-lg cursor-pointer transition-all mb-[-2px] ${
                  selectedTab === tab
                    ? "text-terracotta font-medium border-2 border-tan/30 bg-tan/25 border-b-transparent"
                    : "text-terracotta font-medium border-2 border-tan/30 bg-tan/25 border-b-transparent opacity-50"
                } ${tab === Tab.SAVED ? "ml-[-2px]" : ""}`}
              >
                {t(`tabs.${tab}`)}
              </button>
            ))}
          </div>

          {selectedTab === "saved" ? (
            <SavedRecipesPanel
              savedRecipes={savedRecipes}
              onRecipeDelete={handleDeleteRecipe}
            />
          ) : (
            <ExtractRecipePanel
              recipe={recipe}
              error={error}
              url={url}
              isLoading={isLoading}
              geminiApiKey={geminiApiKey}
              onSaveRecipe={handleSaveRecipe}
              onExtractRecipe={handleExtractRecipe}
              onApiKeySave={setGeminiApiKey}
              isRecipeSaved={isCurrentRecipeSaved()}
            />
          )}
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <LocaleProvider>
      <MainContent />
    </LocaleProvider>
  );
}
