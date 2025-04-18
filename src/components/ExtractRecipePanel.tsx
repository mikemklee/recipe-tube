import React from "react";
import { Recipe } from "@/types";
import { motion } from "framer-motion";
import RecipeDisplay from "./RecipeDisplay";
import LoadingSpinner from "./LoadingSpinner";
import UrlInputForm from "./UrlInputForm";
import ApiKeyInput from "./ApiKeyInput";
import { useLocale } from "@/context/LocaleContext";

interface ExtractRecipePanelProps {
  recipe: Recipe | null | undefined;
  error: string | null;
  url: string;
  isLoading: boolean;
  geminiApiKey: string | undefined;
  onSaveRecipe: () => void;
  onExtractRecipe: (youtubeUrl: string) => Promise<void>;
  onApiKeySave: (key: string | undefined) => void;
  isRecipeSaved: boolean;
}

const ExtractRecipePanel: React.FC<ExtractRecipePanelProps> = ({
  recipe,
  error,
  url,
  isLoading,
  geminiApiKey,
  onSaveRecipe,
  onExtractRecipe,
  onApiKeySave,
  isRecipeSaved,
}) => {
  const { t } = useLocale();

  return (
    <>
      {error && (
        <motion.div
          className="w-full mt-6 p-4 border-2 border-orange-300 rounded-xl shadow-md bg-orange-100 mb-8 text-orange-800 flex flex-col gap-2"
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

      <ApiKeyInput initialKey={geminiApiKey} onSave={onApiKeySave} />

      <hr className="border-t-2 border-tan/30 my-4" />

      <UrlInputForm onSubmit={onExtractRecipe} isLoading={isLoading} />

      {recipe && !isLoading && (
        <motion.div
          className="w-full mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <RecipeDisplay
            recipe={recipe}
            onSaveRecipe={onSaveRecipe}
            isSaved={isRecipeSaved}
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
    </>
  );
};

export default ExtractRecipePanel;
