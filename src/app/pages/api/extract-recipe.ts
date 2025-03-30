import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { fetchTranscript, TranscriptError } from '@/lib/youtube';
import { extractRecipeFromTranscript, AiProcessingError } from '@/lib/gemini';
import { Recipe, ApiError } from '@/types';

// Define the expected request body shape using Zod
const RequestBodySchema = z.object({
  url: z.string().url({ message: "Invalid YouTube URL provided." }),
});

type ResponseData = Recipe | ApiError;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // Validate request body
  const validationResult = RequestBodySchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ message: validationResult.error.errors[0]?.message ?? "Invalid request body." });
  }

  const { url } = validationResult.data;

  try {
    // 1. Fetch Transcript
    const transcript = await fetchTranscript(url);
    console.log(`[API] Transcript fetched successfully for ${url}:`, transcript.length);

    // 2. Extract Recipe using AI
    // We pass the transcript and optionally the URL or fetched video title for context
    const extractedRecipeData = await extractRecipeFromTranscript(transcript /*, optional video title */);

    // 3. Construct the final Recipe object
    const finalRecipe: Recipe = {
      ...extractedRecipeData,
      sourceUrl: url,
      // videoTitle: fetchedVideoTitle // Add if you fetch it separately
    };

    // 4. Return Success Response
    return res.status(200).json(finalRecipe);

  } catch (error: unknown) {
    console.error(`[API Error] Failed to extract recipe for ${url}:`, error);

    if (error instanceof TranscriptError) {
      return res.status(400).json({ message: `Transcript Error: ${error.message}` });
    }
    if (error instanceof AiProcessingError) {
      // AI might fail to find a recipe, or have an internal issue
      return res.status(500).json({ message: `AI Processing Error: ${error.message}` });
    }
    // Handle generic errors
    return res.status(500).json({ message: 'An unexpected error occurred on the server.' });
  }
}