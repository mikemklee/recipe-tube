import React from "react";
import { Recipe } from "@/types";
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
        <div className="w-full mt-6 p-4 border-2 border-orange-300 rounded-xl shadow-md bg-orange-100 mb-8 text-orange-800 flex flex-col gap-2">
          <p className="font-bold">{t("error.title")}</p>
          <p>{error}</p>
          {url && (
            <p className="text-sm font-medium">
              {t("error.url")} {url}
            </p>
          )}
        </div>
      )}

      <ApiKeyInput initialKey={geminiApiKey} onSave={onApiKeySave} />

      <hr className="border-t-2 border-tan/30 my-4" />

      <UrlInputForm onSubmit={onExtractRecipe} isLoading={isLoading} />

      {recipe && !isLoading && (
        <div className="w-full mt-8">
          <RecipeDisplay
            recipe={recipe}
            onSaveRecipe={onSaveRecipe}
            isSaved={isRecipeSaved}
          />
        </div>
      )}

      {isLoading && (
        <div className="my-12 flex flex-col items-center">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
};

export default ExtractRecipePanel;
