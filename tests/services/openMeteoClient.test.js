import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchCurrentWeatherByCity } from "../../src/services/openMeteoClient.js";

describe("openMeteoClient", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("con citta valida restituisce i dati meteo", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            {
              name: "Roma",
              country_code: "IT",
              country: "Italia",
              admin1: "Lazio",
              latitude: 41.9,
              longitude: 12.49,
              population: 2873000
            }
          ]
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current: {
            time: "2026-04-06T12:00",
            temperature_2m: 21.4,
            apparent_temperature: 20.7,
            relative_humidity_2m: 52,
            weather_code: 1,
            wind_speed_10m: 11.2,
            is_day: 1
          },
          daily: {
            time: ["2026-04-06", "2026-04-07"],
            weather_code: [1, 3],
            temperature_2m_min: [12.1, 11.4],
            temperature_2m_max: [23.8, 21.2],
            precipitation_probability_max: [15, 40],
            wind_speed_10m_max: [18.5, 22.3]
          },
          current_units: {
            temperature_2m: "°C",
            wind_speed_10m: "km/h",
            relative_humidity_2m: "%"
          },
          daily_units: {
            precipitation_probability_max: "%",
            wind_speed_10m_max: "km/h"
          }
        })
      });

    const result = await fetchCurrentWeatherByCity("Roma");

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.city).toBe("Roma");
    expect(result.countryCode).toBe("IT");
    expect(result.coordinates).toEqual({ latitude: 41.9, longitude: 12.49 });
    expect(result.current.temperature).toBe(21.4);
    expect(result.daily).toHaveLength(2);
    expect(result.daily[0]).toEqual({
      date: "2026-04-06",
      weatherCode: 1,
      temperatureMin: 12.1,
      temperatureMax: 23.8,
      precipitationProbabilityMax: 15,
      windSpeedMax: 18.5
    });
  });

  it("con citta inesistente restituisce errore", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] })
    });

    await expect(fetchCurrentWeatherByCity("CittaCheNonEsisteXYZ")).rejects.toThrow(
      'Nessun risultato per "CittaCheNonEsisteXYZ".'
    );
  });

  it("restituisce errore se il server risponde 500", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    await expect(fetchCurrentWeatherByCity("Roma")).rejects.toThrow("Errore HTTP: 500");
  });

  it("restituisce errore su timeout/network failure", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Network timeout"));

    await expect(fetchCurrentWeatherByCity("Roma")).rejects.toThrow("Network timeout");
  });

  it("restituisce errore se mancano le previsioni giornaliere", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            {
              name: "Roma",
              country_code: "IT",
              country: "Italia",
              admin1: "Lazio",
              latitude: 41.9,
              longitude: 12.49
            }
          ]
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current: {
            time: "2026-04-06T12:00",
            temperature_2m: 21.4,
            apparent_temperature: 20.7,
            relative_humidity_2m: 52,
            weather_code: 1,
            wind_speed_10m: 11.2,
            is_day: 1
          },
          current_units: {
            temperature_2m: "°C",
            wind_speed_10m: "km/h",
            relative_humidity_2m: "%"
          }
        })
      });

    await expect(fetchCurrentWeatherByCity("Roma")).rejects.toThrow(
      "Previsioni giornaliere non disponibili al momento."
    );
  });
});