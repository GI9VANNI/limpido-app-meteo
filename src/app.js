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

import { WeatherModel } from "./models/weatherModel.js";
import { WeatherView } from "./views/weatherView.js";
import { WeatherController } from "./controllers/weatherController.js";

const formEl = document.getElementById("weather-form");
const cityInputEl = document.getElementById("city-input");
const resultEl = document.getElementById("result");
const statusEl = document.getElementById("status");

const model = new WeatherModel();
const view = new WeatherView({ formEl, cityInputEl, resultEl, statusEl });
const controller = new WeatherController({ model, view });

controller.init();