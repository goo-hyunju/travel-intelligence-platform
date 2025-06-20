"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WeatherService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
const common_1 = require("@nestjs/common");
let WeatherService = WeatherService_1 = class WeatherService {
    constructor() {
        this.logger = new common_1.Logger(WeatherService_1.name);
    }
    async getHistoricalWeatherForMonth(cityName, month) {
        this.logger.log(`Fetching historical weather for ${cityName} for month ${month}`);
        const historicalData = {
            'Cebu': { 7: { text: "우기 시즌. 평균 28°C, 잦은 스콜성 소나기.", icon: '🌦️' } },
            'Nha Trang': { 7: { text: "건기 시즌. 평균 29°C, 맑고 화창함.", icon: '☀️' } },
            'Da Nang': { 7: { text: "가장 더운 달. 평균 30°C, 매우 덥고 습함.", icon: '🥵' } },
            'Fukuoka': { 7: { text: "장마 끝, 무더위 시작. 평균 28°C, 습함.", icon: '♨️' } },
            'Sapporo': { 7: { text: "가장 쾌적한 달. 평균 21°C, 시원함.", icon: '🌸' } },
            'Bangkok': { 7: { text: "우기 시즌. 평균 29°C, 비가 잦음.", icon: '🌧️' } }
        };
        const cityKey = Object.keys(historicalData).find(k => cityName.toLowerCase().includes(k.toLowerCase()));
        if (cityKey && historicalData[cityKey][month]) {
            return historicalData[cityKey][month];
        }
        return null;
    }
};
exports.WeatherService = WeatherService;
exports.WeatherService = WeatherService = WeatherService_1 = __decorate([
    (0, common_1.Injectable)()
], WeatherService);
//# sourceMappingURL=weather.service.js.map