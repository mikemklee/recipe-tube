import React, { useState } from "react";
import { SavedRecipe } from "@/types";
import SavedRecipesList from "./SavedRecipesList";
import RecipeDisplay from "./RecipeDisplay";
import { useLocale } from "@/context/LocaleContext";
import { MdArrowBack } from "react-icons/md";

interface SavedRecipesPanelProps {
  savedRecipes: SavedRecipe[];
  showSavedRecipes: boolean;
  onRecipeDelete: (id: string) => void;
}

const SavedRecipesPanel: React.FC<SavedRecipesPanelProps> = ({
  savedRecipes,
  showSavedRecipes,
  onRecipeDelete,
}) => {
  const { t } = useLocale();
  const [selectedRecipe, setSelectedRecipe] = useState<SavedRecipe | null>(
    null
  );

  if (savedRecipes.length === 0) {
    return null;
  }

  const handleRecipeSelect = (recipe: SavedRecipe) => {
    setSelectedRecipe(recipe);
  };

  const handleBackToList = () => {
    setSelectedRecipe(null);
  };

  return (
    <>
      {showSavedRecipes && (
        <>
          {selectedRecipe ? (
            <>
              <div className="mb-4">
                <button
                  onClick={handleBackToList}
                  className="flex items-center gap-1 text-sm text-terracotta hover:text-terracotta/80 cursor-pointer"
                >
                  <MdArrowBack />
                  {t("savedRecipes.backToList")}
                </button>
              </div>
              <RecipeDisplay
                recipe={selectedRecipe}
                isSaved={true}
                onSaveRecipe={() => {}}
              />
            </>
          ) : (
            <>
              <h1 className="font-bold mb-3 text-black text-lg">
                {t("savedRecipes.title")}
              </h1>
              <SavedRecipesList
                savedRecipes={savedRecipes}
                onRecipeSelect={handleRecipeSelect}
                onRecipeDelete={onRecipeDelete}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default SavedRecipesPanel;
