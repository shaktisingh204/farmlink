
import { config } from 'dotenv';
config();

import '@/ai/flows/optimize-distribution.ts';
import '@/ai/flows/real-time-price-summarization.ts';
import '@/ai/flows/fair-price-estimator.ts';
import '@/ai/flows/produce-pricer-flow.ts';
import '@/ai/flows/market-suggestion-flow.ts';
import '@/ai/flows/deal-recommender-flow.ts';
import '@/ai/flows/faq-bot-flow.ts';
import '@/ai/flows/agri-assist-flow.ts';
