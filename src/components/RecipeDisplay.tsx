import React from "react";
import { Recipe } from "@/types";
import { useLocale } from "@/context/LocaleContext";
import { MdBookmarkAdd, MdBookmark } from "react-icons/md";

interface RecipeDisplayProps {
  recipe: Recipe;
  onSaveRecipe?: () => void;
  isSaved?: boolean;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({
  recipe,
  onSaveRecipe,
  isSaved = false,
}) => {
  const { t } = useLocale();

  const handleSave = () => {
    if (isSaved) return;
    if (onSaveRecipe) {
      onSaveRecipe();
    }
  };

  return (
    <div className="shadow-xl rounded-lg p-6 border-2 border-tan">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-black">{recipe.title}</h2>
        {onSaveRecipe && (
          <button
            onClick={handleSave}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
              isSaved
                ? "bg-terracotta/10 text-terracotta"
                : "bg-terracotta text-white hover:bg-terracotta/90"
            }`}
          >
            {isSaved ? <MdBookmark size={18} /> : <MdBookmarkAdd size={18} />}
            {isSaved ? t("recipe.savedButton") : t("recipe.saveButton")}
          </button>
        )}
      </div>

      {recipe.description && (
        <p className="text-black text-sm mb-4">{recipe.description}</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-black border-b pb-4 border-tan">
        {recipe.prepTime && (
          <div>
            <strong>{t("recipe.prep")}:</strong> {recipe.prepTime}
          </div>
        )}
        {recipe.cookTime && (
          <div>
            <strong>{t("recipe.cook")}:</strong> {recipe.cookTime}
          </div>
        )}
        {recipe.totalTime && (
          <div>
            <strong>{t("recipe.total")}:</strong> {recipe.totalTime}
          </div>
        )}
        {recipe.servings && (
          <div>
            <strong>{t("recipe.servings")}:</strong> {recipe.servings}
          </div>
        )}
      </div>

      <div className="mb-4 border-b pb-4 border-tan">
        <h3 className="text-xl font-semibold mb-3 text-black">
          {t("recipe.ingredients")}
        </h3>
        <ul className="list-disc list-inside space-y-1 text-black">
          {recipe.ingredients.map((ing, index) => (
            <li key={index} className="text-sm">
              <span className="">
                {ing.name.charAt(0).toUpperCase() + ing.name.substring(1)}
              </span>
              {ing.quantity && (
                <span className="font-medium text-gray-600">
                  {" "}
                  {ing.quantity}
                </span>
              )}
              {ing.unit && <span className="text-gray-600"> {ing.unit}</span>}
              {ing.preparation && (
                <span className="text-gray-600">, {ing.preparation}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3 text-black">
          {t("recipe.instructions")}
        </h3>
        <ol className="list-decimal list-inside space-y-3 text-black ">
          {recipe.instructions.map((inst) => (
            <li key={inst.step} className="pl-2 text-sm">
              {inst.description}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-6 pt-4 border-t border-tan text-sm text-black">
        <p>
          {t("recipe.extractedFrom")}:{" "}
          <a
            href={recipe.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-terracotta hover:underline"
          >
            {recipe.sourceUrl}
          </a>
        </p>
        {recipe.videoTitle && (
          <p>
            {t("recipe.originalTitle")}: {recipe.videoTitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default RecipeDisplay;
