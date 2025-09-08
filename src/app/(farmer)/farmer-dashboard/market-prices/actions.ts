'use server';

import { XMLParser } from 'fast-xml-parser';

export interface MarketRecord {
  State: string;
  District: string;
  Market: string;
  Commodity: string;
  Variety: string;
  Grade: string;
  Arrival_Date: string;
  Min_Price: string;
  Max_Price: string;
  Modal_Price: string;
  Commodity_Code: string;
}

export interface MarketDataParams {
  offset?: number;
  limit?: number;
  filters?: {
    State?: string;
    District?: string;
    Commodity?: string;
    Arrival_Date?: string;
  };
}

export async function getMarketData(params: MarketDataParams = {}): Promise<MarketRecord[]> {
  const { offset = 0, limit = 10, filters = {} } = params;
  const apiKey = '579b464db66ec23bdd0000018efebc38e78249b16bb4854257316ec3';
  const baseUrl = 'https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24';

  const urlParams = new URLSearchParams({
    'api-key': apiKey,
    format: 'xml',
    offset: String(offset),
    limit: String(limit),
  });

  if (filters.State) urlParams.append('filters[State]', filters.State);
  if (filters.District) urlParams.append('filters[District]', filters.District);
  if (filters.Commodity) urlParams.append('filters[Commodity]', filters.Commodity);
  if (filters.Arrival_Date) urlParams.append('filters[Arrival_Date]', filters.Arrival_Date);

  try {
    const response = await fetch(`${baseUrl}?${urlParams.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const xmlData = await response.text();
    const parser = new XMLParser();
    const jsonData = parser.parse(xmlData);

    if (jsonData.result && jsonData.result.records && jsonData.result.records.item) {
        let records = jsonData.result.records.item;
        if (!Array.isArray(records)) {
          records = [records];
        }
        return records;
    } else {
        return [];
    }

  } catch (error) {
    console.error("Error fetching market data:", error);
    return [];
  }
}
