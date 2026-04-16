import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/services/openMeteoClient.js", () => ({
  fetchCurrentWeatherByCity: vi.fn()
}));

import { fetchCurrentWeatherByCity } from "../../src/services/openMeteoClient.js";
import { WeatherModel } from "../../src/models/weatherModel.js";

describe("WeatherModel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rifiuta input vuoto", async () => {
    const model = new WeatherModel();

    await expect(model.getWeatherByCity("   ")).rejects.toThrow("Inserisci una città valida.");
    expect(fetchCurrentWeatherByCity).not.toHaveBeenCalled();
  });

  it("accetta una citta valida e delega al service", async () => {
    const model = new WeatherModel();
    const mockedPayload = { city: "Roma", countryCode: "IT" };
    fetchCurrentWeatherByCity.mockResolvedValueOnce(mockedPayload);

    const result = await model.getWeatherByCity("Roma");

    expect(fetchCurrentWeatherByCity).toHaveBeenCalledWith("Roma");
    expect(result).toEqual(mockedPayload);
  });
});