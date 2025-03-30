import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchTranscriptViaInnerTube, TranscriptError } from '@/lib/youtube';
import {
  extractRecipeFromTranscript,
  AiProcessingError
} from '@/lib/gemini';
import { Recipe } from '@/types';

// Define the expected request body shape using Zod
const RequestBodySchema = z.object({
  url: z.string().url({ message: "Invalid YouTube URL provided." }),
  locale: z.enum(['en', 'ko']).default('en')
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request body
    const validationResult = RequestBodySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: validationResult.error.errors[0]?.message ?? "Invalid request body." },
        { status: 400 }
      );
    }

    const { url, locale } = validationResult.data;

    // 1. Fetch Transcript
    const transcript = await fetchTranscriptViaInnerTube(url);

    // 2. Extract Recipe using AI
    const extractedRecipeData = await extractRecipeFromTranscript(transcript, locale);

    // 3. Construct the final Recipe object
    const finalRecipe: Recipe = {
      ...extractedRecipeData,
      sourceUrl: url,
    };

    // 4. Return Success Response
    return NextResponse.json(finalRecipe);

  } catch (error: unknown) {
    console.error(`[API Error] Failed to extract recipe:`, error);

    if (error instanceof TranscriptError) {
      return NextResponse.json({ message: `Transcript Error: ${error.message}` }, { status: 400 });
    }
    if (error instanceof AiProcessingError) {
      return NextResponse.json({ message: `AI Processing Error: ${error.message}` }, { status: 500 });
    }
    // Handle generic errors
    return NextResponse.json({ message: 'An unexpected error occurred on the server.' }, { status: 500 });
  }
}