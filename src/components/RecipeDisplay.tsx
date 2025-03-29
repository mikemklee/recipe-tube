import React from 'react';
import { Recipe } from '@/types';

interface RecipeDisplayProps {
  recipe: Recipe;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-4">{recipe.title}</h2>

      {recipe.description && (
        <p className="text-gray-700 mb-4">{recipe.description}</p>
      )}

       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm text-gray-600 border-b pb-4">
          {recipe.prepTime && <div><strong>Prep:</strong> {recipe.prepTime}</div>}
          {recipe.cookTime && <div><strong>Cook:</strong> {recipe.cookTime}</div>}
          {recipe.totalTime && <div><strong>Total:</strong> {recipe.totalTime}</div>}
          {recipe.servings && <div><strong>Servings:</strong> {recipe.servings}</div>}
       </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Ingredients</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-800">
          {recipe.ingredients.map((ing, index) => (
            <li key={index}>
              {ing.quantity && <span className="font-medium">{ing.quantity} </span>}
              {ing.unit && <span className="italic text-gray-600">{ing.unit} </span>}
              <span>{ing.name}</span>
              {ing.preparation && <span className="text-gray-500">, {ing.preparation}</span>}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3">Instructions</h3>
        <ol className="list-decimal list-inside space-y-3 text-gray-800">
          {recipe.instructions.map((inst) => (
            <li key={inst.step} className="pl-2">
               <span className="font-medium">Step {inst.step}: </span>
               {inst.description}
            </li>
          ))}
        </ol>
      </div>

       <div className="mt-6 pt-4 border-t text-sm text-gray-500">
          <p>Extracted from: <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{recipe.sourceUrl}</a></p>
          {recipe.videoTitle && <p>Original Video Title: {recipe.videoTitle}</p>}
       </div>
    </div>
  );
};

export default RecipeDisplay;