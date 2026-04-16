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

import { API_CONFIG } from "../config/apiConfig.js";

function buildUrl(baseUrl, params) {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Errore HTTP: ${response.status}`);
  }
  return response.json();
}

async function findCity(city) {
  const geocodingUrl = buildUrl(API_CONFIG.geocodingBaseUrl, {
    name: city,
    count: API_CONFIG.geocodingCount,
    language: API_CONFIG.language
  });

  const geocodingData = await fetchJson(geocodingUrl);
  const results = geocodingData?.results || [];
  const cityResult = results.sort((a, b) => {
    const exactA = a.name?.toLowerCase() === city.toLowerCase() ? 1 : 0;
    const exactB = b.name?.toLowerCase() === city.toLowerCase() ? 1 : 0;
    if (exactA !== exactB) {
      return exactB - exactA;
    }
    return (b.population || 0) - (a.population || 0);
  })[0];

  if (!cityResult) {
    throw new Error(`Nessun risultato per "${city}".`);
  }

  return {
    name: cityResult.name,
    countryCode: cityResult.country_code,
    country: cityResult.country,
    admin1: cityResult.admin1,
    latitude: cityResult.latitude,
    longitude: cityResult.longitude
  };
}

function mapDailyForecast(daily) {
  const count = daily?.time?.length || 0;
  return Array.from({ length: count }, (_, index) => ({
    date: daily.time[index],
    weatherCode: daily.weather_code[index],
    temperatureMin: daily.temperature_2m_min[index],
    temperatureMax: daily.temperature_2m_max[index],
    precipitationProbabilityMax: daily.precipitation_probability_max[index],
    windSpeedMax: daily.wind_speed_10m_max[index]
  }));
}

async function fetchWeatherForecast(latitude, longitude) {
  const forecastUrl = buildUrl(API_CONFIG.forecastBaseUrl, {
    latitude,
    longitude,
    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max",
    forecast_days: 7,
    timezone: API_CONFIG.timezone
  });

  const forecastData = await fetchJson(forecastUrl);
  const current = forecastData?.current;
  const currentUnits = forecastData?.current_units || {};
  const daily = forecastData?.daily;
  const dailyUnits = forecastData?.daily_units || {};

  if (!current) {
    throw new Error("Dati meteo non disponibili al momento.");
  }
  if (!daily?.time?.length) {
    throw new Error("Previsioni giornaliere non disponibili al momento.");
  }

  return {
    current: {
      time: current.time,
      temperature: current.temperature_2m,
      apparentTemperature: current.apparent_temperature,
      relativeHumidity: current.relative_humidity_2m,
      weatherCode: current.weather_code,
      windSpeed: current.wind_speed_10m,
      isDay: current.is_day
    },
    daily: mapDailyForecast(daily),
    units: {
      temperature: currentUnits.temperature_2m || "°C",
      windSpeed: currentUnits.wind_speed_10m || "km/h",
      relativeHumidity: currentUnits.relative_humidity_2m || "%",
      precipitationProbability:
        dailyUnits.precipitation_probability_max || "%",
      dailyWindSpeed: dailyUnits.wind_speed_10m_max || "km/h"
    }
  };
}

export async function fetchCurrentWeatherByCity(city) {
  const cityData = await findCity(city);
  const weather = await fetchWeatherForecast(cityData.latitude, cityData.longitude);
  return {
    city: cityData.name,
    countryCode: cityData.countryCode,
    country: cityData.country,
    region: cityData.admin1,
    coordinates: {
      latitude: cityData.latitude,
      longitude: cityData.longitude
    },
    ...weather
  };
}