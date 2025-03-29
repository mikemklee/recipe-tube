'use client';

import { useState } from 'react';
import { Recipe, ApiError } from '@/types';
import UrlInputForm from '@/components/UrlInputForm';
import RecipeDisplay from '@/components/RecipeDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import { motion } from 'framer-motion';

const dummyRecipe: Recipe = {
  "title": "One-Pan Mushroom Milk Cream Pasta",
  "description": "An easy one-pan pasta dish featuring oyster mushrooms in a simple milk cream sauce.",
  "prepTime": undefined,
  "cookTime": undefined,
  "totalTime": undefined,
  "servings": "1",
  "ingredients": [
    {
      "quantity": 1,
      "unit": "pack (160g)",
      "name": "Oyster mushrooms",
      "preparation": "base trimmed, chopped into bite-sized pieces"
    },
    {
      "quantity": 5,
      "unit": "T",
      "name": "Olive oil"
    },
    {
      "quantity": "1/4",
      "unit": "T",
      "name": "Salt"
    },
    {
      "quantity": 1,
      "unit": "T",
      "name": "Garlic",
      "preparation": "minced"
    },
    {
      "quantity": "1/3",
      "unit": "T",
      "name": "Crushed red pepper flakes or Peperoncino",
      "preparation": "(adjustable to taste)"
    },
    {
      "quantity": 1,
      "unit": "serving (120g)",
      "name": "Linguine pasta"
    },
    {
      "quantity": 1,
      "unit": "T",
      "name": "Tuna sauce",
      "preparation": "(can substitute with salt or chicken stock)"
    },
    {
      "quantity": 1,
      "unit": "T (20g)",
      "name": "Butter"
    },
    {
      "quantity": 200,
      "unit": "ml",
      "name": "Milk"
    },
    {
      "quantity": 360,
      "unit": "ml",
      "name": "Water"
    },
    {
      "quantity": 1,
      "unit": "T",
      "name": "Truffle oil",
      "preparation": "optional"
    },
    {
      "quantity": null,
      "unit": "sprinkle",
      "name": "Parsley",
      "preparation": "optional, for garnish"
    }
  ],
  "instructions": [
    {
      "step": 1,
      "description": "Trim the base off the oyster mushrooms and chop them into bite-sized pieces."
    },
    {
      "step": 2,
      "description": "Add olive oil to a pan and heat over medium-high heat."
    },
    {
      "step": 3,
      "description": "Add the chopped mushrooms and sauté until golden brown. Add salt."
    },
    {
      "step": 4,
      "description": "Reduce heat to medium-low, add minced garlic, and sauté until fragrant."
    },
    {
      "step": 5,
      "description": "Turn off the heat and stir in the crushed red pepper flakes."
    },
    {
      "step": 6,
      "description": "Add linguine pasta, tuna sauce, butter, milk, and water to the pan."
    },
    {
      "step": 7,
      "description": "Turn the heat to medium-high and bring to a boil. Let the liquid reduce for 4-5 minutes, stirring occasionally to prevent pasta from sticking."
    },
    {
      "step": 8,
      "description": "Continue cooking until the pasta is cooked through and the sauce has thickened (you should be able to see the bottom of the pan when pulling the pasta aside). Add more water if needed to finish cooking the pasta."
    },
    {
      "step": 9,
      "description": "Plate the pasta."
    },
    {
      "step": 10,
      "description": "(Optional) Drizzle with truffle oil."
    },
    {
      "step": 11,
      "description": "(Optional) Garnish with a sprinkle of parsley before serving."
    }
  ],
  "sourceUrl": "https://www.youtube.com/watch?v=Xg6hN_lZprE"
}

export default function Home() {
  const [recipe, setRecipe] = useState<Recipe | null>(dummyRecipe);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');

  const handleExtractRecipe = async (youtubeUrl: string) => {
    setIsLoading(true);
    setError(null);
    setRecipe(null);
    setUrl(youtubeUrl);

    try {
      const response = await fetch('/api/extract-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: youtubeUrl }),
      });

      const data: Recipe | ApiError = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiError).message || `Request failed with status ${response.status}`);
      }

      if ('ingredients' in data && 'instructions' in data) {
        setRecipe(data);
        console.log(JSON.stringify(data, null, 2))
      } else {
        throw new Error((data as ApiError).message || 'Received unexpected data format from API.');
      }

    } catch (err: any) {
      console.error('Extraction failed:', err);
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-12 max-w-[40rem]">
        <div className="mb-6">
          <h1
            className="text-3xl font-semibold text-black mb-3"
          >
            Youtube recipe extractor
          </h1>
          <p className="text-black text-sm text-gray-700 border-l-2 pl-2 border-tan italic mb-2 flex flex-col">
            <span>
              Extract nicely formatted recipes from cooking videos with a single click!
            </span>
            <span>
              Works best with videos that clearly demonstrate recipes step by step.
            </span>
          </p>
        </div>


        {isLoading && (
          <motion.div
            className="my-12 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <LoadingSpinner />
          </motion.div>
        )}

        {error && (
          <motion.div
            className="w-full mt-6 p-6 border-2 border-orange-300 rounded-xl shadow-md bg-orange-100 mb-8 text-orange-800 flex flex-col gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="font-bold">Something went wrong!</p>
            <p>{error}</p>
            {url && <p className="text-sm font-medium">URL: {url}</p>}
          </motion.div>
        )}

        <motion.div
          className="p-4 rounded-xl shadow-xl w-full bg-beige"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <UrlInputForm onSubmit={handleExtractRecipe} isLoading={isLoading} />
        </motion.div>

        {recipe && !isLoading && (
          <motion.div
            className="w-full mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <RecipeDisplay recipe={recipe} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
