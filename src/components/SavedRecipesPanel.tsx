import React from "react";
import { SavedRecipe } from "@/types";
import SavedRecipesList from "./SavedRecipesList";
import { motion } from "framer-motion";
import { MdBookmarks } from "react-icons/md";
import { useLocale } from "@/context/LocaleContext";

interface SavedRecipesPanelProps {
  savedRecipes: SavedRecipe[];
  showSavedRecipes: boolean;
  setShowSavedRecipes: (show: boolean) => void;
  onRecipeSelect: (recipe: SavedRecipe) => void;
  onRecipeDelete: (id: string) => void;
}

const SavedRecipesPanel: React.FC<SavedRecipesPanelProps> = ({
  savedRecipes,
  showSavedRecipes,
  setShowSavedRecipes,
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

      <motion.button
        className="fixed bottom-6 right-6 bg-terracotta hover:bg-terracotta/90 text-white rounded-full shadow-lg flex items-center justify-center w-auto h-10 z-50 p-4 gap-2 text-sm md:hidden"
        onClick={() => setShowSavedRecipes(!showSavedRecipes)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <MdBookmarks />
        <span>{t("savedRecipes.toggle")}</span>
      </motion.button>
    </>
  );
};

export default SavedRecipesPanel;
