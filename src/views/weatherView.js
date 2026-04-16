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

import {
  formatCoordinate,
  formatDateTime,
  formatDayLabel,
  formatMetric,
  getWeatherDescription,
  getWeatherIcon
} from "../utils/formatters.js";

export class WeatherView {
  constructor({ formEl, cityInputEl, resultEl, statusEl }) {
    this.formEl = formEl;
    this.cityInputEl = cityInputEl;
    this.resultEl = resultEl;
    this.statusEl = statusEl;
    this.searchButtonEl = this.formEl.querySelector('button[type="submit"]');
    this.resetButtonEl = this.formEl.querySelector("#reset-search");
  }

  bindCitySearch(onSearch) {
    this.formEl.addEventListener("submit", (event) => {
      event.preventDefault();
      onSearch(this.cityInputEl.value);
    });
  }

  bindReset(onReset) {
    this.resetButtonEl.addEventListener("click", () => {
      onReset();
    });
  }

  bindDaySelection(onDaySelect) {
    this.resultEl.addEventListener("click", (event) => {
      const dayButton = event.target.closest("[data-day-index]");
      if (!dayButton) {
        return;
      }
      const dayIndex = Number(dayButton.getAttribute("data-day-index"));
      onDaySelect(dayIndex);
    });
  }

  setLoading(isLoading) {
    this.searchButtonEl.disabled = isLoading;
    this.resetButtonEl.disabled = isLoading;
    if (isLoading) {
      this.statusEl.classList.remove("error");
      this.statusEl.textContent = "Caricamento...";
      return;
    }
    this.statusEl.textContent = "";
  }

  renderEmptyState() {
    this.resultEl.innerHTML = `
      <p class="muted">Nessun dato meteo da mostrare. Cerca una città.</p>
    `;
  }

  renderWeather(data, selectedDayIndex = 0) {
    this.statusEl.classList.remove("error");
    this.statusEl.textContent = "";
    const currentWeatherLabel = getWeatherDescription(data.current.weatherCode);
    const currentWeatherIcon = getWeatherIcon(data.current.weatherCode, Boolean(data.current.isDay));
    const safeSelectedIndex = Math.min(Math.max(selectedDayIndex, 0), data.daily.length - 1);
    const selectedDay = data.daily[safeSelectedIndex];
    const selectedDayLabel = getWeatherDescription(selectedDay.weatherCode);

    this.resultEl.innerHTML = `
      <div class="weather-summary">
        <div class="weather-summary__icon" aria-hidden="true">${currentWeatherIcon}</div>
        <div>
          <h2>${data.city}, ${data.countryCode}</h2>
          <p class="weather-summary__condition">${currentWeatherLabel}</p>
        </div>
      </div>
      <p class="muted">Aggiornato: ${formatDateTime(data.current.time)}</p>
      <p class="muted">Localita: ${data.region || "-"}, ${data.country || "-"}</p>
      <div class="weather-grid">
        <article class="weather-item">
          <h3>Temperatura</h3>
          <p>${formatMetric(data.current.temperature, data.units.temperature)}</p>
        </article>
        <article class="weather-item">
          <h3>Percepita</h3>
          <p>${formatMetric(data.current.apparentTemperature, data.units.temperature)}</p>
        </article>
        <article class="weather-item">
          <h3>Umidita</h3>
          <p>${formatMetric(data.current.relativeHumidity, data.units.relativeHumidity)}</p>
        </article>
        <article class="weather-item">
          <h3>Vento</h3>
          <p>${formatMetric(data.current.windSpeed, data.units.windSpeed)}</p>
        </article>
        <article class="weather-item">
          <h3>Coordinate</h3>
          <p>${formatCoordinate(data.coordinates.latitude)}, ${formatCoordinate(data.coordinates.longitude)}</p>
        </article>
      </div>
      <h3 class="forecast-title">Previsioni prossimi giorni</h3>
      <div class="forecast-days" role="list" aria-label="Previsioni giornaliere">
        ${data.daily
        .map((day, index) => {
          const dayIcon = getWeatherIcon(day.weatherCode, true);
          const activeClass = index === safeSelectedIndex ? " day-card--active" : "";
          return `
              <button
                type="button"
                class="day-card${activeClass}"
                role="listitem"
                data-day-index="${index}"
                aria-pressed="${index === safeSelectedIndex}"
              >
                <span class="day-card__label">${formatDayLabel(day.date, index)}</span>
                <span class="day-card__icon" aria-hidden="true">${dayIcon}</span>
                <span class="day-card__temp">
                  ${Math.round(day.temperatureMin)}° / ${Math.round(day.temperatureMax)}°
                </span>
              </button>
            `;
        })
        .join("")}
      </div>
      <article class="card day-details">
        <h3>Dettaglio ${formatDayLabel(selectedDay.date, safeSelectedIndex)}</h3>
        <p class="day-details__condition">${selectedDayLabel}</p>
        <div class="weather-grid">
          <article class="weather-item">
            <h3>Min / Max</h3>
            <p>
              ${formatMetric(selectedDay.temperatureMin, data.units.temperature)} /
              ${formatMetric(selectedDay.temperatureMax, data.units.temperature)}
            </p>
          </article>
          <article class="weather-item">
            <h3>Pioggia (max)</h3>
            <p>${formatMetric(selectedDay.precipitationProbabilityMax, data.units.precipitationProbability)}</p>
          </article>
          <article class="weather-item">
            <h3>Vento (max)</h3>
            <p>${formatMetric(selectedDay.windSpeedMax, data.units.dailyWindSpeed)}</p>
          </article>
        </div>
      </article>
    `;
  }

  renderError(message) {
    this.resultEl.innerHTML = "";
    this.statusEl.textContent = message;
    this.statusEl.classList.add("error");
  }

  resetSearch() {
    this.cityInputEl.value = "";
    this.statusEl.textContent = "";
    this.statusEl.classList.remove("error");
    this.renderEmptyState();
    this.cityInputEl.focus();
  }
}