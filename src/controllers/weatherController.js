/*
 * Limpido - App Meteo
 * Copyright (C) 2026 Giovanni Staiano
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

export class WeatherController {
  constructor({ model, view }) {
    this.model = model;
    this.view = view;
    this.lastWeatherData = null;
    this.selectedDayIndex = 0;
  }

  init() {
    this.view.bindCitySearch(this.handleCitySearch.bind(this));
    this.view.bindReset(this.handleReset.bind(this));
    this.view.bindDaySelection(this.handleDaySelection.bind(this));
    this.view.renderEmptyState();
  }

  async handleCitySearch(rawCity) {
    try {
      this.view.setLoading(true);
      const weatherData = await this.model.getWeatherByCity(rawCity);
      this.lastWeatherData = weatherData;
      this.selectedDayIndex = 0;
      this.view.renderWeather(weatherData, this.selectedDayIndex);
    } catch (error) {
      this.view.renderError(error.message || "Errore inatteso.");
    } finally {
      this.view.setLoading(false);
    }
  }

  handleDaySelection(dayIndex) {
    if (!this.lastWeatherData || Number.isNaN(dayIndex)) {
      return;
    }
    if (dayIndex < 0 || dayIndex >= this.lastWeatherData.daily.length) {
      return;
    }
    this.selectedDayIndex = dayIndex;
    this.view.renderWeather(this.lastWeatherData, this.selectedDayIndex);
  }

  handleReset() {
    this.lastWeatherData = null;
    this.selectedDayIndex = 0;
    this.view.resetSearch();
  }
}