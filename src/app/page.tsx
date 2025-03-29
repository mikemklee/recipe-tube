'use client';

import { useState } from 'react';
import { Recipe, ApiError } from '@/types';
import UrlInputForm from '@/components/UrlInputForm';
import RecipeDisplay from '@/components/RecipeDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import { motion } from 'framer-motion';

export default function Home() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
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
        <motion.main 
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-12">
            <motion.h1 
              className="text-3xl font-semibold text-black mb-3"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.2
              }}
            >
              YouTube Recipe Extractor
            </motion.h1>
            <p className="text-black mb-4">
              Transform cooking videos into beautifully formatted recipes with just one click
            </p>
           
          </div>

          {isLoading && (
            <motion.div 
              className="my-12 flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <LoadingSpinner />
              <p className="mt-4 font-medium text-black">
                Extracting recipe... this may take a moment
              </p>
            </motion.div>
          )}

          {error && (
            <motion.div 
              className="w-full mt-6 p-6 border border-red-200 text-black rounded-xl shadow-md bg-beige"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-2">
                <p className="font-bold text-lg">Error</p>
              </div>
              <p className="mb-2">{error}</p>
              {url && <p className="text-sm mt-2 text-black font-medium">URL: {url}</p>}
            </motion.div>
          )}

          {recipe && !isLoading && (
            <motion.div 
              className="w-full mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <RecipeDisplay recipe={recipe} />
            </motion.div>
          )}

          {!recipe && !isLoading && !error && (
            <motion.div 
              className=" p-8 rounded-xl shadow-xl w-full bg-beige"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >


              <div className="mb-6">
                <UrlInputForm onSubmit={handleExtractRecipe} isLoading={isLoading} />
              </div>
              <p className="text-black text-sm text-gray-700 border-l-2 pl-2 border-tan italic">
                
                Works best with videos that clearly demonstrate recipes step by step
              </p>
            </motion.div>
          )}
        </motion.main>
      </div>
    </div>
  );
}
