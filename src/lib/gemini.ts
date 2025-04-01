import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { Recipe } from "@/types";
import { geminiRateLimiter } from "./rate-limiter";

// Error classes
export class NoApiKeyError extends Error {
  constructor() {
    super("No Gemini API key provided. Please enter your API key.");
    this.name = "NoApiKeyError";
  }
}

export const getGeminiClient = (apiKey?: string) => {
  const key = apiKey || process.env.GEMINI_API_KEY;

  if (!key) {
    throw new NoApiKeyError();
  }

  return new GoogleGenerativeAI(key);
};

export class AiProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiProcessingError";
  }
}

export class RateLimitError extends Error {
  constructor() {
    super("API rate limit exceeded. Please try again later.");
    this.name = "RateLimitError";
  }
}

// Helper function to parse and validate the AI response
function parseAiResponse(
  rawResponse: string
): Omit<Recipe, "sourceUrl" | "videoTitle"> {
  if (!rawResponse) {
    throw new AiProcessingError("AI returned an empty response.");
  }

  const rawResponsePreview = rawResponse.substring(0, 100);

  let extractedData;
  try {
    // Try direct JSON parsing first
    extractedData = JSON.parse(rawResponse);
  } catch (error) {
    console.warn("Failed to parse JSON directly:", error);

    // If direct parsing fails, try to extract JSON from the text
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new AiProcessingError(
        `No valid JSON found in response. Raw response begins with: ${rawResponsePreview}...`
      );
    }

    try {
      extractedData = JSON.parse(jsonMatch[0]);
    } catch (extractionError) {
      console.error("Failed to parse JSON from AI response:", extractionError);

      throw new AiProcessingError(
        `Failed to parse extracted JSON. Raw response begins with: ${rawResponsePreview}...`
      );
    }
  }

  // Validate the parsed data
  if (extractedData.error) {
    throw new AiProcessingError(extractedData.error);
  }

  if (
    !extractedData.title ||
    !Array.isArray(extractedData.ingredients) ||
    !Array.isArray(extractedData.instructions)
  ) {
    throw new AiProcessingError(
      "AI response is missing required recipe fields (title, ingredients, instructions)."
    );
  }

  return extractedData;
}

export async function extractRecipeFromTranscript(
  transcript: string,
  locale: "en" | "ko" = "en",
  videoTitle?: string,
  apiKey?: string
): Promise<Omit<Recipe, "sourceUrl" | "videoTitle">> {
  // Check rate limit before making API call
  const rateLimitKey = "gemini-api";
  if (geminiRateLimiter.isRateLimited(rateLimitKey)) {
    throw new RateLimitError();
  }

  // Prepare prompts
  const systemPrompt = `
You are an expert recipe extraction assistant. Your task is to analyze the provided video transcript
and extract the recipe details in a structured JSON format.

Follow these rules strictly:
1.  Identify the main recipe being demonstrated. Ignore unrelated chatter, introductions, or outros unless they contain recipe information.
2.  Extract the ingredients list. For each ingredient, identify the quantity, unit (if applicable, e.g., cup, tbsp, g, clove), name, and any preparation notes (e.g., chopped, melted, sifted). If quantity or unit is unclear, use null or make a reasonable guess (like '1' for 'an onion').
3.  Extract the step-by-step instructions. Number the steps sequentially starting from 1. Keep instructions concise and action-oriented.
4.  Extract metadata if mentioned: preparation time, cooking time, total time, and number of servings. If not explicitly mentioned, omit these fields or set them to null.
5.  Determine a suitable title for the recipe. You can use the video title as a hint if provided.
6.  Output *only* the JSON object representing the recipe, adhering to the following TypeScript interface:

    interface RecipeIngredient {
      quantity: string | number | null;
      unit: string | null;
      name: string;
      preparation?: string;
    }

    interface RecipeInstruction {
      step: number;
      description: string;
    }

    interface ExtractedRecipe {
      title: string;
      description?: string;
      prepTime?: string;
      cookTime?: string;
      totalTime?: string;
      servings?: string;
      ingredients: RecipeIngredient[];
      instructions: RecipeInstruction[];
    }

7.  If no clear recipe can be extracted from the transcript, return a JSON object with an error field: { "error": "Could not extract a recipe from the provided transcript." }
8.  Do not include any introductory text, concluding remarks, or explanations outside the JSON object in your response. Just the JSON.
9.  Importantly, respond in ${locale === "ko" ? "Korean" : "English"}.`;

  const userPrompt = `
Video Title (optional context): ${videoTitle || "N/A"}

Video Transcript:
---
${transcript.substring(
  0,
  15000
)} // Limit transcript length if needed for the model's context window
---

Extract the recipe based on the rules and provide the JSON output.`;

  try {
    const genAI = getGeminiClient(apiKey);

    // Configure the model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro-exp-03-25",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
      generationConfig: {
        temperature: 0.2, // Lower temperature for more deterministic output
        topP: 0.8,
        topK: 40,
      },
    });

    // Make the API request
    const result = await model.generateContent([systemPrompt, userPrompt]);
    const response = await result.response;
    const rawResponse = response.text();

    // Parse and validate the response
    const extractedData = parseAiResponse(rawResponse);

    return extractedData;
  } catch (error) {
    // Handle specific error types
    if (error instanceof RateLimitError || error instanceof AiProcessingError) {
      throw error; // Just re-throw these custom errors
    }

    // For all other errors, wrap in AiProcessingError with a clear message
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new AiProcessingError(`AI processing failed: ${errorMessage}`);
  }
}
