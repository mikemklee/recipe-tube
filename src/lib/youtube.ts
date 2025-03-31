import { YoutubeTranscript } from "youtube-transcript";
import { Innertube } from "youtubei.js/web";

let innerTube: Innertube | null = null;
export const initInnerTube = async () => {
  if (innerTube) return innerTube;

  const youtube = await Innertube.create({
    lang: "en",
    location: "US",
    retrieve_player: false,
  });

  innerTube = youtube;
  return innerTube;
};

// Basic error class for transcript fetching issues
export class TranscriptError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TranscriptError";
  }
}

/**
 * Fetches the transcript for a given YouTube video URL.
 * @param url - The YouTube video URL or ID.
 * @returns The concatenated transcript text.
 * @throws {TranscriptError} If the transcript cannot be fetched.
 */
export async function fetchTranscript(url: string): Promise<string> {
  try {
    console.log(`Fetching transcript for URL: ${url}`);
    // The library can often handle full URLs or just video IDs
    const transcriptItems = await YoutubeTranscript.fetchTranscript(url);

    if (!transcriptItems || transcriptItems.length === 0) {
      throw new TranscriptError(
        "No transcript found or video does not have transcripts enabled."
      );
    }

    // Concatenate transcript parts into a single string
    const fullTranscript = transcriptItems.map((item) => item.text).join(" ");
    console.log(
      `Successfully fetched transcript (length: ${fullTranscript.length})`
    );
    return fullTranscript;
  } catch (error: unknown) {
    console.error("Error fetching YouTube transcript:", error);

    if (error instanceof Error) {
      // Improve error message based on potential library errors
      if (
        error.message.includes("disabled transcript") ||
        error.message.includes("No transcript found")
      ) {
        throw new TranscriptError(
          "Transcripts are disabled for this video or could not be found."
        );
      }
      if (
        error.message.includes("invalid video ID") ||
        error.message.includes("No video id found")
      ) {
        throw new TranscriptError("Invalid YouTube URL or Video ID.");
      }
      // Generic error
      throw new TranscriptError(`Failed to fetch transcript: ${error.message}`);
    }

    // Handle cases where error is not an instance of Error
    throw new TranscriptError("Failed to fetch transcript: Unknown error");
  }
}

export const fetchTranscriptViaInnerTube = async (
  url: string
): Promise<string> => {
  try {
    // extract the video ID from the URL
    let videoId: string | undefined;

    // Check for standard youtube.com links (v=VIDEO_ID)
    if (url.includes("youtube.com") && url.includes("v=")) {
      videoId = url.split("v=")[1]?.split(/[?&]/)[0];
    }
    // Check for youtu.be short links
    else if (url.includes("youtu.be")) {
      videoId = url.split("youtu.be/")[1]?.split(/[?&]/)[0];
    }
    // Check for shorts
    else if (url.includes("shorts")) {
      videoId = url.split("/shorts/")[1]?.split(/[?&]/)[0];
    }

    if (!videoId) {
      throw new TranscriptError("Invalid YouTube URL or Video ID.");
    }

    console.log(`Fetching transcript for video ID: ${videoId}`);

    const youtube = await initInnerTube();
    if (!youtube) {
      throw new TranscriptError("Failed to initialize Innertube API client.");
    }

    const info = await youtube.getInfo(videoId);
    const transcriptData = await info.getTranscript();

    const segments =
      transcriptData.transcript.content?.body?.initial_segments ?? [];
    if (segments.length === 0) {
      throw new TranscriptError("No transcript segments found.");
    }
    console.log(
      `Successfully fetched transcript segments (count: ${segments.length})`
    );

    return segments.map((segment) => segment.snippet.text || "").join(" ");
  } catch (error) {
    console.error("Error fetching transcript:", error);
    throw error;
  }
};
