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

import { fetchCurrentWeatherByCity } from "../services/openMeteoClient.js";

const CITY_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,60}$/;

export class WeatherModel {
  async getWeatherByCity(city) {
    const normalizedCity = String(city || "")
      .trim()
      .replace(/\s+/g, " ");

    if (!normalizedCity) {
      throw new Error("Inserisci una città valida.");
    }
    if (!CITY_PATTERN.test(normalizedCity)) {
      throw new Error("Usa solo lettere, spazi, apostrofi o trattini (2-60 caratteri).");
    }

    return fetchCurrentWeatherByCity(normalizedCity);
  }
}