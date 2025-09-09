'use server';

/**
 * @fileOverview An AI agent that answers frequently asked questions about the FarmLink platform.
 *
 * - faqBotFlow - A function that answers questions.
 * - FaqBotInput - The input type for the function.
 * - FaqBotOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const FaqBotInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({
      text: z.string()
    }))
  })).optional(),
  question: z.string().describe('The user\'s question about the platform.'),
});
export type FaqBotInput = z.infer<typeof FaqBotInputSchema>;

const FaqBotOutputSchema = z.object({
  answer: z.string().describe('The AI\'s answer to the user\'s question.'),
  audioDataUri: z.string().optional().describe('A data URI of the spoken answer in WAV format.'),
});
export type FaqBotOutput = z.infer<typeof FaqBotOutputSchema>;

export async function faqBot(input: FaqBotInput): Promise<FaqBotOutput> {
  return faqBotFlow(input);
}

const systemInstruction = `You are a helpful and friendly FAQ chatbot for a platform called FarmLink.
Your goal is to answer user questions about the platform's features and purpose.
Keep your answers concise, informative, and easy to understand.

Here is some information about FarmLink:
- **Purpose:** FarmLink is an all-in-one platform that connects farmers directly with retailers and local markets. It uses AI to create a more efficient, fair, and transparent agricultural ecosystem.
- **Key Features for Farmers:**
    - **AI Price Advisor:** Helps farmers get fair price recommendations for their produce based on photo quality analysis and real-time market data.
    - **My Produce Listings:** Farmers can list their produce for sale, setting their own prices and quantities.
    - **Market Price Suggestions:** AI analyzes market data to suggest the best markets for a farmer to sell their specific produce.
    - **Orders Received:** Farmers can view and manage incoming orders from retailers.
    - **Distribution Optimizer:** An AI tool that recommends how to distribute produce across different markets to maximize profit and minimize waste.
- **Key Features for Retailers:**
    - **Browse Produce:** Retailers can browse all available produce from all registered farmers.
    - **AI Recommended Deals:** The platform provides personalized deal recommendations to retailers based on their order history and favorited items.
    - **Direct Ordering:** Retailers can place orders directly with farmers through the platform.
- **Key Features for Market Managers:**
    - **Market Overview:** A dashboard to monitor platform activity, including total revenue, user participation, and sales trends.
    - **Logistics Snapshot:** A real-time view of all orders and deliveries.
- **User Portals:** The platform has separate, dedicated portals for Farmers, Retailers, Market Managers, and a system Admin.

When a user asks a question, use the information above to formulate your answer.
If the user's question is not about FarmLink or its features, politely state that you can only answer questions about the platform.
Do not make up features that are not on this list.
`;


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

const faqBotFlow = ai.defineFlow(
  {
    name: 'faqBotFlow',
    inputSchema: FaqBotInputSchema,
    outputSchema: FaqBotOutputSchema,
  },
  async (input) => {
    const { history, question } = input;
    const llmHistory = history?.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const llmResponse = await ai.generate({
        prompt: question,
        history: llmHistory,
        model: 'googleai/gemini-2.5-flash',
        system: systemInstruction,
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
