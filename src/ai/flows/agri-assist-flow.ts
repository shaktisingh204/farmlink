'use server';

/**
 * @fileOverview An AI agent that serves as an agricultural assistant for farmers.
 *
 * - agriAssistFlow - A function that answers farming-related questions.
 * - AgriAssistInput - The input type for the function.
 * - AgriAssistOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const AgriAssistInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({
      text: z.string()
    }))
  })).optional(),
  message: z.string().describe('The farmer\'s question about agriculture.'),
});
export type AgriAssistInput = z.infer<typeof AgriAssistInputSchema>;

const AgriAssistOutputSchema = z.object({
  answer: z.string().describe('The AI\'s answer to the farmer\'s question.'),
  audioDataUri: z.string().optional().describe('A data URI of the spoken answer in WAV format.'),
});
export type AgriAssistOutput = z.infer<typeof AgriAssistOutputSchema>;

export async function agriAssist(input: AgriAssistInput): Promise<AgriAssistOutput> {
  return agriAssistFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const agriAssistFlow = ai.defineFlow(
  {
    name: 'agriAssistFlow',
    inputSchema: AgriAssistInputSchema,
    outputSchema: AgriAssistOutputSchema,
  },
  async (input) => {
    const { history, message } = input;
    const llmHistory = history?.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const llmResponse = await ai.generate({
        prompt: message,
        history: llmHistory,
        model: 'googleai/gemini-2.5-flash',
        system: `You are an expert agricultural assistant. Your audience is farmers in India.
        Your goal is to provide helpful, concise, and actionable answers to their questions.
        Use a friendly and encouraging tone. Keep answers short and to the point where possible.
        `,
    });

    const answer = llmResponse.text;
    
    // Generate TTS audio
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: answer,
    });

    if (!media) {
      return { answer, audioDataUri: undefined };
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    const audioDataUri = 'data:audio/wav;base64,' + (await toWav(audioBuffer));

    return { answer, audioDataUri };
  }
);
