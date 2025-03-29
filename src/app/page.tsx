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

  console.log(recipe)

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
        console.log(data)
         setRecipe(data);
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.main 
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-orange-800 mb-3"
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
            <p className="text-lg text-orange-700 max-w-2xl mx-auto">
              Transform cooking videos into beautifully formatted recipes with just one click
            </p>
          </div>

          <motion.div 
            className="w-full bg-white rounded-xl shadow-xl p-6 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <UrlInputForm onSubmit={handleExtractRecipe} isLoading={isLoading} />
          </motion.div>

          {isLoading && (
            <motion.div 
              className="my-12 flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <LoadingSpinner />
              <p className="mt-4 text-orange-700 font-medium">
                Extracting recipe... this may take a moment
              </p>
            </motion.div>
          )}

          {error && (
            <motion.div 
              className="w-full mt-6 p-6 bg-red-50 border border-red-200 text-red-700 rounded-xl shadow-md"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-2">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                </svg>
                <p className="font-bold text-lg">Error</p>
              </div>
              <p className="mb-2">{error}</p>
              {url && <p className="text-sm mt-2 text-red-500">URL: {url}</p>}
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
              className="text-center mt-12 p-8 bg-orange-100 rounded-xl max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <svg className="w-16 h-16 mx-auto mb-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <p className="text-lg text-orange-800 font-medium">
                Paste a YouTube cooking video URL above to extract the recipe
              </p>
              <p className="text-orange-600 mt-2">
                Works best with videos that clearly demonstrate recipes step by step
              </p>
            </motion.div>
          )}
        </motion.main>

        <footer className="mt-16 text-center text-orange-600 text-sm">
          <p>Built with ❤️ for cooking enthusiasts</p>
        </footer>
      </div>
    </div>
  );
}
