import React from "react";
import { SavedRecipe } from "@/types";
import { useLocale } from "@/context/LocaleContext";
import { RiDeleteBin6Line } from "react-icons/ri";
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
        <div
          key={recipe.id}
          className="flex justify-between items-center cursor-pointer border-l-2 border-tan/50 hover:border-tan/100 transition-all py-1 pl-2"
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
            className="p-2 hover:bg-tan/20 rounded-full text-gray-500/50 hover:text-terracotta transition-all cursor-pointer"
            title={t("savedRecipes.delete")}
          >
            <RiDeleteBin6Line />
          </button>
        </div>
      ))}
    </div>
  );
};

export default SavedRecipesList;
