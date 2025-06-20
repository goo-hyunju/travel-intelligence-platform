"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WeatherService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let WeatherService = WeatherService_1 = class WeatherService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.logger = new common_1.Logger(WeatherService_1.name);
        this.apiKey = this.configService.get('OPENWEATHERMAP_API_KEY');
    }
    async getWeatherByCityName(cityName) {
        if (!this.apiKey) {
            this.logger.warn('OpenWeatherMap API key is not configured.');
            return null;
        }
        const coords = this.getCoordinatesForCity(cityName);
        if (!coords) {
            this.logger.warn(`Coordinates not found for city: ${cityName}`);
            return null;
        }
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${this.apiKey}&units=metric&lang=kr`;
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url));
            const data = response.data;
            const weatherText = `${data.weather[0].description}, 현재 ${data.main.temp.toFixed(1)}°C (체감 ${data.main.feels_like.toFixed(1)}°C)`;
            const weatherIcon = this.getWeatherIcon(data.weather[0].id);
            return { text: weatherText, icon: weatherIcon };
        }
        catch (error) {
            this.logger.error(`Failed to fetch weather for ${cityName}:`, error.response?.data || error.message);
            return null;
        }
    }
    getCoordinatesForCity(cityName) {
        const cityMap = {
            'Cebu': { lat: 10.3157, lon: 123.8854 },
            'Nha Trang': { lat: 12.2388, lon: 109.1967 },
            'Da Nang': { lat: 16.0544, lon: 108.2022 },
            'Fukuoka': { lat: 33.5904, lon: 130.4017 },
            'Sapporo': { lat: 43.0618, lon: 141.3545 },
            'Bangkok': { lat: 13.7563, lon: 100.5018 },
        };
        const key = Object.keys(cityMap).find(k => cityName.toLowerCase().includes(k.toLowerCase()));
        return key ? cityMap[key] : null;
    }
    getWeatherIcon(weatherId) {
        if (weatherId >= 200 && weatherId < 300)
            return '⛈️';
        if (weatherId >= 300 && weatherId < 400)
            return '💧';
        if (weatherId >= 500 && weatherId < 600)
            return '🌧️';
        if (weatherId >= 600 && weatherId < 700)
            return '❄️';
        if (weatherId >= 700 && weatherId < 800)
            return '🌫️';
        if (weatherId === 800)
            return '☀️';
        if (weatherId === 801)
            return '🌤️';
        if (weatherId === 802)
            return '🌥️';
        if (weatherId > 802)
            return '☁️';
        return '🌍';
    }
};
exports.WeatherService = WeatherService;
exports.WeatherService = WeatherService = WeatherService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], WeatherService);
//# sourceMappingURL=weather.service.js.map