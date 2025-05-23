import React, { useState } from "react";
import { SavedRecipe } from "@/types";
import SavedRecipesList from "./SavedRecipesList";
import RecipeDisplay from "./RecipeDisplay";
import { useLocale } from "@/context/LocaleContext";
import { MdArrowBack } from "react-icons/md";

interface SavedRecipesPanelProps {
  savedRecipes: SavedRecipe[];
  onRecipeDelete: (id: string) => void;
}

const SavedRecipesPanel: React.FC<SavedRecipesPanelProps> = ({
  savedRecipes,
  onRecipeDelete,
}) => {
  const { t } = useLocale();
  const [selectedRecipe, setSelectedRecipe] = useState<SavedRecipe | null>(
    null
  );

  const handleRecipeSelect = (recipe: SavedRecipe) => {
    setSelectedRecipe(recipe);
  };

  const handleBackToList = () => {
    setSelectedRecipe(null);
  };

  return (
    <>
      {selectedRecipe ? (
        <>
          <div className="my-4">
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
        <div className="mt-6">
          <SavedRecipesList
            savedRecipes={savedRecipes}
            onRecipeSelect={handleRecipeSelect}
            onRecipeDelete={onRecipeDelete}
          />
        </div>
      )}
    </>
  );
};

export default SavedRecipesPanel;
