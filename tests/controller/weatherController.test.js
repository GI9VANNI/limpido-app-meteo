import { describe, expect, it, vi } from "vitest";
import { WeatherController } from "../../src/controllers/weatherController.js";

describe("WeatherController", () => {
  it("con citta valida chiama model e renderizza il meteo", async () => {
    const payload = {
      city: "Roma",
      countryCode: "IT",
      daily: [{ date: "2026-04-13" }]
    };
    const model = {
      getWeatherByCity: vi.fn().mockResolvedValue(payload)
    };
    const view = {
      bindCitySearch: vi.fn(),
      bindReset: vi.fn(),
      renderEmptyState: vi.fn(),
      setLoading: vi.fn(),
      renderWeather: vi.fn(),
      renderError: vi.fn(),
      resetSearch: vi.fn()
    };
    const controller = new WeatherController({ model, view });

    await controller.handleCitySearch("Roma");

    expect(view.setLoading).toHaveBeenNthCalledWith(1, true);
    expect(model.getWeatherByCity).toHaveBeenCalledWith("Roma");
    expect(view.renderWeather).toHaveBeenCalledWith(payload, 0);
    expect(view.renderError).not.toHaveBeenCalled();
    expect(view.setLoading).toHaveBeenLastCalledWith(false);
  });

  it("se il model fallisce mostra errore e spegne loading", async () => {
    const model = {
      getWeatherByCity: vi.fn().mockRejectedValue(new Error("Nessun risultato per \"Xyz\"."))
    };
    const view = {
      bindCitySearch: vi.fn(),
      bindReset: vi.fn(),
      renderEmptyState: vi.fn(),
      setLoading: vi.fn(),
      renderWeather: vi.fn(),
      renderError: vi.fn(),
      resetSearch: vi.fn()
    };
    const controller = new WeatherController({ model, view });

    await controller.handleCitySearch("Xyz");

    expect(view.renderError).toHaveBeenCalledWith("Nessun risultato per \"Xyz\".");
    expect(view.renderWeather).not.toHaveBeenCalled();
    expect(view.setLoading).toHaveBeenLastCalledWith(false);
  });

  it("seleziona un giorno valido e aggiorna la vista", () => {
    const payload = {
      city: "Roma",
      countryCode: "IT",
      daily: [{ date: "2026-04-13" }, { date: "2026-04-14" }]
    };
    const model = {
      getWeatherByCity: vi.fn()
    };
    const view = {
      bindCitySearch: vi.fn(),
      bindReset: vi.fn(),
      bindDaySelection: vi.fn(),
      renderEmptyState: vi.fn(),
      setLoading: vi.fn(),
      renderWeather: vi.fn(),
      renderError: vi.fn(),
      resetSearch: vi.fn()
    };
    const controller = new WeatherController({ model, view });
    controller.lastWeatherData = payload;

    controller.handleDaySelection(1);

    expect(view.renderWeather).toHaveBeenCalledWith(payload, 1);
  });
});