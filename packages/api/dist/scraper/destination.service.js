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
var DestinationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DestinationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const weather_service_1 = require("../weather/weather.service");
const country_info_service_1 = require("../country-info/country-info.service");
const flight_scraper_service_1 = require("../scraper/flight-scraper.service");
let DestinationService = DestinationService_1 = class DestinationService {
    constructor(prisma, weatherService, countryInfoService, flightScraperService) {
        this.prisma = prisma;
        this.weatherService = weatherService;
        this.countryInfoService = countryInfoService;
        this.flightScraperService = flightScraperService;
        this.logger = new common_1.Logger(DestinationService_1.name);
    }
    async findAll() {
        const destinations = await this.prisma.destination.findMany();
        const enrichedDestinations = await Promise.all(destinations.map(async (dest) => this.enrichDestination(dest)));
        return enrichedDestinations;
    }
    async findOneById(id) {
        const destination = await this.prisma.destination.findUnique({ where: { id } });
        if (!destination)
            return null;
        return this.enrichDestination(destination);
    }
    async enrichDestination(destination) {
        const targetMonth = 7;
        const iataMap = {
            cebu: 'CEB',
            nhatrang: 'CXR',
            danang: 'DAD',
            fukuoka: 'FUK',
            sapporo: 'CTS',
            bangkok: 'BKK',
        };
        const iataCode = iataMap[destination.id];
        const [historicalWeather, countryInfo, flightInfo] = await Promise.all([
            this.weatherService.getHistoricalWeatherForMonth(destination.nameEn, targetMonth),
            this.countryInfoService.getInfoByCountryName(destination.nameEn),
            iataCode ? this.flightScraperService.scrapeFlightInfo('ICN', iataCode) : Promise.resolve(null),
        ]);
        const updatedDest = { ...destination };
        if (historicalWeather)
            updatedDest.weather = historicalWeather;
        if (countryInfo)
            updatedDest.summary = countryInfo.replace(/<[^>]*>?/gm, ' ').replace(/ㅇ/g, '•');
        if (flightInfo) {
            updatedDest.flight = { time: flightInfo.time, cost: `약 ${flightInfo.price.toLocaleString()}원 ~` };
            if (typeof updatedDest.expenses === 'object' && updatedDest.expenses !== null && 'breakdown' in updatedDest.expenses) {
                const expenses = updatedDest.expenses;
                expenses.breakdown.flight = flightInfo.price;
            }
        }
        return updatedDest;
    }
};
exports.DestinationService = DestinationService;
exports.DestinationService = DestinationService = DestinationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        weather_service_1.WeatherService,
        country_info_service_1.CountryInfoService,
        flight_scraper_service_1.FlightScraperService])
], DestinationService);
//# sourceMappingURL=destination.service.js.map