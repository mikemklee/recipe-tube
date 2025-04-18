import React, { useState } from "react";
import { SavedRecipe } from "@/types";
import SavedRecipesList from "./SavedRecipesList";
import RecipeDisplay from "./RecipeDisplay";
import { motion } from "framer-motion";
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
        <motion.div
          className="mb-6 p-4 bg-white/50 border border-tan rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          {selectedRecipe ? (
            <>
              <div className="mb-4">
                <button
                  onClick={handleBackToList}
                  className="flex items-center gap-1 text-sm text-terracotta hover:text-terracotta/80"
                >
                  <MdArrowBack size={18} />
                  {t("savedRecipes.backToList")}
                </button>
              </div>
              <RecipeDisplay recipe={selectedRecipe} />
            </>
          ) : (
            <>
              <h2 className="font-bold mb-3 text-black">
                {t("savedRecipes.title")}
              </h2>
              <SavedRecipesList
                savedRecipes={savedRecipes}
                onRecipeSelect={handleRecipeSelect}
                onRecipeDelete={onRecipeDelete}
              />
            </>
          )}
        </motion.div>
      )}
    </>
  );
};

export default SavedRecipesPanel;
