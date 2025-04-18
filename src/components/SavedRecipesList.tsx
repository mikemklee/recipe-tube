import React from "react";
import { SavedRecipe } from "@/types";
import { useLocale } from "@/context/LocaleContext";
import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";
import { formatDate } from "@/lib/utils";

interface SavedRecipesListProps {
  savedRecipes: SavedRecipe[];
  onRecipeSelect: (recipe: SavedRecipe) => void;
  onRecipeDelete: (id: string) => void;
}

const SavedRecipesList: React.FC<SavedRecipesListProps> = ({
  savedRecipes,
  onRecipeSelect,
  onRecipeDelete,
}) => {
  const { t } = useLocale();

  if (savedRecipes.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        {t("savedRecipes.noRecipes")}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {savedRecipes.map((recipe) => (
        <motion.div
          key={recipe.id}
          className="bg-white rounded-lg p-4 shadow-sm border border-tan hover:shadow-md transition-shadow cursor-pointer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
        >
          <div
            className="flex justify-between items-center"
            onClick={() => onRecipeSelect(recipe)}
          >
            <div className="flex-1">
              <h3 className="font-medium text-terracotta">{recipe.title}</h3>
              <p className="text-xs text-gray-500">
                {t("savedRecipes.savedOn")}: {formatDate(recipe.savedAt)}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRecipeDelete(recipe.id);
              }}
              className="p-1 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
              title={t("savedRecipes.delete")}
            >
              <MdDelete size={18} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SavedRecipesList;
