import { config } from 'dotenv';
config();

import '@/ai/flows/optimize-distribution.ts';
import '@/ai/flows/real-time-price-summarization.ts';
import '@/ai/flows/fair-price-estimator.ts';
import '@/ai/flows/produce-pricer-flow.ts';
import '@/ai/flows/market-suggestion-flow.ts';
