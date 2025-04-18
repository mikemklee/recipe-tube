import React from "react";
import { SavedRecipe } from "@/types";
import SavedRecipesList from "./SavedRecipesList";
import { motion } from "framer-motion";
import { useLocale } from "@/context/LocaleContext";

interface SavedRecipesPanelProps {
  savedRecipes: SavedRecipe[];
  showSavedRecipes: boolean;
  onRecipeSelect: (recipe: SavedRecipe) => void;
  onRecipeDelete: (id: string) => void;
}

const SavedRecipesPanel: React.FC<SavedRecipesPanelProps> = ({
  savedRecipes,
  showSavedRecipes,
  onRecipeSelect,
  onRecipeDelete,
}) => {
  const { t } = useLocale();

  if (savedRecipes.length === 0) {
    return null;
  }

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
          <h2 className="font-bold mb-3 text-black">
            {t("savedRecipes.title")}
          </h2>
          <SavedRecipesList
            savedRecipes={savedRecipes}
            onRecipeSelect={onRecipeSelect}
            onRecipeDelete={onRecipeDelete}
          />
        </motion.div>
      )}
    </>
  );
};

export default SavedRecipesPanel;
