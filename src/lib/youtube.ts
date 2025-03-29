import { YoutubeTranscript } from 'youtube-transcript';

// Basic error class for transcript fetching issues
export class TranscriptError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TranscriptError';
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
      throw new TranscriptError('No transcript found or video does not have transcripts enabled.');
    }

    // Concatenate transcript parts into a single string
    const fullTranscript = transcriptItems.map(item => item.text).join(' ');
    console.log(`Successfully fetched transcript (length: ${fullTranscript.length})`);
    return fullTranscript;

  } catch (error: any) {
    console.error('Error fetching YouTube transcript:', error);
    // Improve error message based on potential library errors
    if (error.message?.includes('disabled transcript') || error.message?.includes('No transcript found')) {
       throw new TranscriptError('Transcripts are disabled for this video or could not be found.');
    }
     if (error.message?.includes('invalid video ID') || error.message?.includes('No video id found')) {
       throw new TranscriptError('Invalid YouTube URL or Video ID.');
    }
    // Generic error
    throw new TranscriptError(`Failed to fetch transcript: ${error.message || 'Unknown error'}`);
  }
}