import type { MarketData, MarketDataProvider } from "@/types/vibe";

const MOCK_DATA: Record<string, MarketData> = {
  NVDA: { ticker: "NVDA", name: "NVIDIA Corporation", sector: "Technology", region: "US" },
  AMD: { ticker: "AMD", name: "Advanced Micro Devices", sector: "Technology", region: "US" },
  AVGO: { ticker: "AVGO", name: "Broadcom Inc.", sector: "Technology", region: "US" },
  EQIX: { ticker: "EQIX", name: "Equinix Inc.", sector: "Real Estate", region: "US" },
  DLR: { ticker: "DLR", name: "Digital Realty Trust", sector: "Real Estate", region: "US" },
  VRT: { ticker: "VRT", name: "Vertiv Holdings", sector: "Industrials", region: "US" },
  ETN: { ticker: "ETN", name: "Eaton Corporation", sector: "Industrials", region: "US" },
  NEE: { ticker: "NEE", name: "NextEra Energy", sector: "Utilities", region: "US" },
  URA: { ticker: "URA", name: "Global X Uranium ETF", sector: "Energy", region: "Global" },
  GRID: { ticker: "GRID", name: "First Trust Nasdaq Clean Edge Smart Grid ETF", sector: "Utilities", region: "US" },
  BOTZ: { ticker: "BOTZ", name: "Global X Robotics & AI ETF", sector: "Technology", region: "Global" },
  CIBR: { ticker: "CIBR", name: "First Trust NASDAQ Cybersecurity ETF", sector: "Technology", region: "US" },
  HACK: { ticker: "HACK", name: "ETFMG Prime Cyber Security ETF", sector: "Technology", region: "US" },
  WCLD: { ticker: "WCLD", name: "WisdomTree Cloud Computing ETF", sector: "Technology", region: "US" },
  FTXH: { ticker: "FTXH", name: "First Trust Health Care AlphaDEX ETF", sector: "Healthcare", region: "US" },
  XLV: { ticker: "XLV", name: "Health Care Select Sector SPDR ETF", sector: "Healthcare", region: "US" },
  SMR: { ticker: "SMR", name: "NuScale Power Corporation", sector: "Energy", region: "US" },
  INDA: { ticker: "INDA", name: "iShares MSCI India ETF", sector: "Diversified", region: "India" },
  EPOL: { ticker: "EPOL", name: "iShares MSCI Poland ETF", sector: "Diversified", region: "Europe" },
  PETS: { ticker: "PETS", name: "PetMed Express", sector: "Consumer", region: "US" },
};

export class MockMarketDataProvider implements MarketDataProvider {
  async getTickerData(ticker: string): Promise<MarketData | null> {
    return MOCK_DATA[ticker.toUpperCase()] ?? null;
  }

  async searchTickers(query: string): Promise<MarketData[]> {
    const q = query.toLowerCase();
    return Object.values(MOCK_DATA).filter(
      (d) =>
        d.ticker.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q) ||
        (d.sector ?? "").toLowerCase().includes(q)
    );
  }
}

export const defaultMarketDataProvider: MarketDataProvider = new MockMarketDataProvider();
