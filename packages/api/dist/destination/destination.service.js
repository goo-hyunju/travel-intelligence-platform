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
let DestinationService = DestinationService_1 = class DestinationService {
    constructor(prisma, weatherService) {
        this.prisma = prisma;
        this.weatherService = weatherService;
        this.logger = new common_1.Logger(DestinationService_1.name);
    }
    async findAll() {
        const destinations = await this.prisma.destination.findMany();
        const enrichedDestinations = await Promise.all(destinations.map(async (dest) => {
            const liveWeather = await this.weatherService.getWeatherByCityName(dest.nameEn);
            if (liveWeather) {
                this.logger.log(`Fetched live weather for ${dest.name}`);
                return { ...dest, weather: liveWeather };
            }
            return dest;
        }));
        return enrichedDestinations;
    }
    async findOneById(id) {
        const destination = await this.prisma.destination.findUnique({
            where: { id },
        });
        if (!destination) {
            return null;
        }
        const liveWeather = await this.weatherService.getWeatherByCityName(destination.nameEn);
        if (liveWeather) {
            this.logger.log(`Fetched live weather for ${destination.name}`);
            return { ...destination, weather: liveWeather };
        }
        return destination;
    }
};
exports.DestinationService = DestinationService;
exports.DestinationService = DestinationService = DestinationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        weather_service_1.WeatherService])
], DestinationService);
//# sourceMappingURL=destination.service.js.map