"use client";
import React, { useState, useEffect } from "react";
import { Recipe, ApiError, SavedRecipe } from "@/types";
import UrlInputForm from "@/components/UrlInputForm";
import RecipeDisplay from "@/components/RecipeDisplay";
import LoadingSpinner from "@/components/LoadingSpinner";
import ApiKeyInput from "@/components/ApiKeyInput";
import SavedRecipesList from "@/components/SavedRecipesList";
import { motion } from "framer-motion";
import { MdBookmarks, MdExpandMore, MdExpandLess } from "react-icons/md";
import { generateId } from "@/lib/utils";
import { LocaleProvider, useLocale } from "@/context/LocaleContext";

function MainContent() {
  const { locale, setLocale, t } = useLocale();
  const [recipe, setRecipe] = useState<Recipe | null>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");
  const [geminiApiKey, setGeminiApiKey] = useState<string | undefined>();
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [showSavedRecipes, setShowSavedRecipes] = useState<boolean>(false);

  useEffect(() => {
    const storedKey = localStorage.getItem("geminiApiKey");
    if (storedKey) {
      setGeminiApiKey(storedKey);
    }

    // Load saved recipes from localStorage
    const storedRecipes = localStorage.getItem("savedRecipes");
    if (storedRecipes) {
      try {
        setSavedRecipes(JSON.parse(storedRecipes));
      } catch (e) {
        console.error("Failed to parse saved recipes:", e);
      }
    }
  }, []);

  // Function to save the current recipe
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

  // Function to delete a saved recipe
  const handleDeleteRecipe = (id: string) => {
    const updatedRecipes = savedRecipes.filter((recipe) => recipe.id !== id);
    setSavedRecipes(updatedRecipes);
    localStorage.setItem("savedRecipes", JSON.stringify(updatedRecipes));
  };

  // Function to select a saved recipe
  const handleSelectRecipe = (savedRecipe: SavedRecipe) => {
    setRecipe(savedRecipe);
  };

  // Check if the current recipe is saved
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

          {/* Saved Recipes Toggle */}
          {savedRecipes.length > 0 && (
            <div className="mb-6">
              <button
                onClick={() => setShowSavedRecipes(!showSavedRecipes)}
                className="flex items-center gap-1 px-3 py-2 bg-tan hover:bg-tan/80 text-black rounded-md text-sm transition-colors w-full"
              >
                <MdBookmarks size={18} className="text-terracotta" />
                {showSavedRecipes
                  ? t("savedRecipes.hide")
                  : t("savedRecipes.toggle")}
                {showSavedRecipes ? (
                  <MdExpandLess size={18} />
                ) : (
                  <MdExpandMore size={18} />
                )}
                <span className="ml-auto bg-terracotta text-white text-xs px-2 py-0.5 rounded-full">
                  {savedRecipes.length}
                </span>
              </button>
            </div>
          )}

          {/* Saved Recipes List */}
          {showSavedRecipes && savedRecipes.length > 0 && (
            <motion.div
              className="mb-6 p-4 bg-white/50 border border-tan rounded-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="font-bold mb-3 text-black">
                {t("savedRecipes.title")}
              </h2>
              <SavedRecipesList
                savedRecipes={savedRecipes}
                onRecipeSelect={handleSelectRecipe}
                onRecipeDelete={handleDeleteRecipe}
              />
            </motion.div>
          )}

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

          <ApiKeyInput initialKey={geminiApiKey} onSave={setGeminiApiKey} />

          <UrlInputForm onSubmit={handleExtractRecipe} isLoading={isLoading} />

          {recipe && !isLoading && (
            <motion.div
              className="w-full mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <RecipeDisplay
                recipe={recipe}
                onSaveRecipe={handleSaveRecipe}
                isSaved={isCurrentRecipeSaved()}
              />
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

      {/* Floating button fixed to the bottom of the screen */}
      <motion.button
        className="fixed bottom-6 right-6 bg-terracotta hover:bg-terracotta/90 text-white rounded-full shadow-lg flex items-center justify-center w-auto h-10 z-50 p-4 gap-2 text-sm"
        onClick={() => setShowSavedRecipes(!showSavedRecipes)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <MdBookmarks />
        <span>Browse saved recipes</span>
      </motion.button>
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
