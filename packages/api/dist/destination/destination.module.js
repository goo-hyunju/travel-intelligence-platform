"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DestinationModule = void 0;
const common_1 = require("@nestjs/common");
const destination_resolver_1 = require("./destination.resolver");
const destination_service_1 = require("./destination.service");
const prisma_module_1 = require("../prisma/prisma.module");
const weather_module_1 = require("../weather/weather.module");
const country_info_module_1 = require("../country-info/country-info.module");
const flight_scraper_module_1 = require("../scraper/flight-scraper.module");
let DestinationModule = class DestinationModule {
};
exports.DestinationModule = DestinationModule;
exports.DestinationModule = DestinationModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, weather_module_1.WeatherModule, country_info_module_1.CountryInfoModule, flight_scraper_module_1.FlightScraperModule],
        providers: [destination_resolver_1.DestinationResolver, destination_service_1.DestinationService],
    })
], DestinationModule);
//# sourceMappingURL=destination.module.js.map