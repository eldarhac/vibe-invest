import { MockMarketDataProvider } from "../marketData";

describe("MockMarketDataProvider", () => {
  const provider = new MockMarketDataProvider();

  it("returns data for known ticker", async () => {
    const data = await provider.getTickerData("NVDA");
    expect(data).not.toBeNull();
    expect(data?.ticker).toBe("NVDA");
    expect(data?.name).toBe("NVIDIA Corporation");
  });

  it("returns null for unknown ticker", async () => {
    const data = await provider.getTickerData("ZZZUNKNOWN");
    expect(data).toBeNull();
  });

  it("is case-insensitive for ticker lookup", async () => {
    const data = await provider.getTickerData("nvda");
    expect(data).not.toBeNull();
  });

  it("searchTickers returns matches by name", async () => {
    const results = await provider.searchTickers("energy");
    expect(results.length).toBeGreaterThan(0);
  });

  it("searchTickers returns empty array for no match", async () => {
    const results = await provider.searchTickers("xyznonexistentthing99");
    expect(results).toEqual([]);
  });
});
