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
var FlightScraperService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlightScraperService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const cheerio = require("cheerio");
let FlightScraperService = FlightScraperService_1 = class FlightScraperService {
    constructor(httpService) {
        this.httpService = httpService;
        this.logger = new common_1.Logger(FlightScraperService_1.name);
    }
    async scrapeFlightInfo(origin, destination) {
        const url = `https://www.kayak.co.kr/flights/${origin}-${destination}/2025-07-15/2025-07-20?sort=price_a`;
        this.logger.log(`Scraping flight info from: ${url}`);
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36' },
            }));
            const $ = cheerio.load(response.data);
            const priceText = $('.J0x0 .f8F1-price-text').first().text();
            const timeText = $('.J0x0 .xdW8-duration').first().text();
            if (!priceText) {
                this.logger.warn(`Price not found for ${origin}-${destination}.`);
                return null;
            }
            const price = parseInt(priceText.replace(/[^0-9]/g, ''));
            this.logger.log(`Scraped Data for ${destination}: Price - ${price}, Time - ${timeText}`);
            return { price, time: timeText };
        }
        catch (error) {
            this.logger.error(`Failed to scrape flight info for ${origin}-${destination}:`, error.message);
            return null;
        }
    }
};
exports.FlightScraperService = FlightScraperService;
exports.FlightScraperService = FlightScraperService = FlightScraperService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], FlightScraperService);
//# sourceMappingURL=flight-scraper.service.js.map