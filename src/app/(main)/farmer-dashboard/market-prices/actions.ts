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

export async function getMarketData(): Promise<MarketRecord[]> {
  try {
    const response = await fetch('https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24?api-key=579b464db66ec23bdd0000018efebc38e78249b16bb4854257316ec3&format=xml');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const xmlData = await response.text();
    const parser = new XMLParser();
    const jsonData = parser.parse(xmlData);

    let records = jsonData.result.records.item;

    if (!Array.isArray(records)) {
      records = [records];
    }
    
    return records;
  } catch (error) {
    console.error("Error fetching market data:", error);
    return [];
  }
}
