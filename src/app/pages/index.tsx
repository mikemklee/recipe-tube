import { useState } from 'react';
import Head from 'next/head';
import { Recipe, ApiError } from '@/types';
import UrlInputForm from '@/components/UrlInputForm';
import RecipeDisplay from '@/components/RecipeDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<string>(''); // Keep track of the URL used

  const handleExtractRecipe = async (youtubeUrl: string) => {
    setIsLoading(true);
    setError(null);
    setRecipe(null);
    setUrl(youtubeUrl); // Store the URL for display/retry

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
        // Handle API errors (those returned with non-2xx status codes)
        throw new Error((data as ApiError).message || `Request failed with status ${response.status}`);
      }

      // Type guard to ensure data is Recipe
      if ('ingredients' in data && 'instructions' in data) {
         setRecipe(data);
      } else {
         // This case might happen if the API returns 200 but with an error structure
         // Although our current API aims to return non-200 for errors
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
    <div className="container mx-auto p-4 max-w-3xl">
      <Head>
        <title>YouTube Recipe Extractor</title>
        <meta name="description" content="Extract structured recipes from YouTube videos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center space-y-6">
        <h1 className="text-3xl font-bold text-center mt-8 mb-6">
          YouTube Recipe Extractor 🍲🎬
        </h1>

        <UrlInputForm onSubmit={handleExtractRecipe} isLoading={isLoading} />

        {isLoading && <LoadingSpinner />}

        {error && (
          <div className="w-full mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
             {url && <p className="text-sm mt-2">URL: {url}</p>}
          </div>
        )}

        {recipe && !isLoading && (
          <div className="w-full mt-8">
             <RecipeDisplay recipe={recipe} />
          </div>
        )}

        {!recipe && !isLoading && !error && (
             <p className="text-gray-500 mt-8">Enter a YouTube video URL above to get started.</p>
        )}
      </main>
    </div>
  );
}