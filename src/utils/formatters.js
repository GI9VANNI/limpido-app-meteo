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

const WEATHER_CODE_MAP = {
  0: "Sereno",
  1: "Prevalentemente sereno",
  2: "Parzialmente nuvoloso",
  3: "Coperto",
  45: "Nebbia",
  48: "Nebbia con brina",
  51: "Pioviggine leggera",
  53: "Pioviggine moderata",
  55: "Pioviggine intensa",
  61: "Pioggia leggera",
  63: "Pioggia moderata",
  65: "Pioggia intensa",
  71: "Neve leggera",
  73: "Neve moderata",
  75: "Neve intensa",
  80: "Rovesci leggeri",
  81: "Rovesci moderati",
  82: "Rovesci intensi",
  85: "Rovesci di neve leggeri",
  86: "Rovesci di neve intensi",
  95: "Temporale",
  96: "Temporale con grandine leggera",
  99: "Temporale con grandine intensa"
};

export function formatDateTime(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleString("it-IT", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

export function formatTemperature(temp) {
  return `${Math.round(temp)}°C`;
}

export function formatMetric(value, unit) {
  return `${Math.round(value)} ${unit}`;
}

export function formatCoordinate(value) {
  return Number(value).toFixed(2);
}

export function formatDayLabel(isoDate, dayIndex = 0) {
  if (dayIndex === 0) {
    return "Oggi";
  }
  const date = new Date(isoDate);
  return date.toLocaleDateString("it-IT", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit"
  });
}

export function getWeatherDescription(weatherCode) {
  return WEATHER_CODE_MAP[weatherCode] || "Condizione non disponibile";
}

export function getWeatherIcon(weatherCode, isDay) {
  if (weatherCode === 0) {
    return isDay ? "☀️" : "🌙";
  }
  if ([1, 2].includes(weatherCode)) {
    return isDay ? "⛅" : "☁️";
  }
  if (weatherCode === 3) {
    return "☁️";
  }
  if ([45, 48].includes(weatherCode)) {
    return "🌫️";
  }
  if ([51, 53, 55, 56, 57].includes(weatherCode)) {
    return "🌦️";
  }
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    return "🌧️";
  }
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return "❄️";
  }
  if ([95, 96, 99].includes(weatherCode)) {
    return "⛈️";
  }
  return "🌡️";
}