import React from 'react';
import { Recipe } from '@/types';

interface RecipeDisplayProps {
  recipe: Recipe;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe }) => {
  return (
    <div className="shadow-md rounded-lg p-6 border border-gray-200 bg-beige">
      <h2 className="text-xl font-bold mb-4 text-black">{recipe.title}</h2>

      {recipe.description && (
        <p className="text-black text-sm mb-4">{recipe.description}</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-black border-b pb-4 border-tan">
        {recipe.prepTime && <div><strong>Prep:</strong> {recipe.prepTime}</div>}
        {recipe.cookTime && <div><strong>Cook:</strong> {recipe.cookTime}</div>}
        {recipe.totalTime && <div><strong>Total:</strong> {recipe.totalTime}</div>}
        {recipe.servings && <div><strong>Servings:</strong> {recipe.servings}</div>}
      </div>

      <div className="mb-4 border-b pb-4 border-tan">
        <h3 className="text-xl font-semibold mb-3 text-black">Ingredients</h3>
        <ul className="list-disc list-inside space-y-1 text-black">
          {recipe.ingredients.map((ing, index) => (
            <li key={index} className="text-sm">
              {ing.quantity && <span className="font-medium text-gray-600">{ing.quantity} </span>}
              {ing.unit && <span className="text-gray-600">{ing.unit} </span>}
              <span>{ing.name}</span>
              {ing.preparation && <span className="text-gray-600">, {ing.preparation}</span>}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3 text-black">Instructions</h3>
        <ol className="list-decimal list-inside space-y-3 text-black ">
          {recipe.instructions.map((inst) => (
            <li key={inst.step} className="pl-2 text-sm">
              {inst.description}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-6 pt-4 border-t border-tan text-sm text-black">
        <p>Extracted from: <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-terracotta hover:underline">{recipe.sourceUrl}</a></p>
        {recipe.videoTitle && <p>Original Video Title: {recipe.videoTitle}</p>}
      </div>
    </div>
  );
};

export default RecipeDisplay;