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
var CountryInfoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryInfoService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const convert = require("xml-js");
let CountryInfoService = CountryInfoService_1 = class CountryInfoService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.logger = new common_1.Logger(CountryInfoService_1.name);
        this.baseUrl = 'http://apis.data.go.kr/1262000/CountryBasicService/getCountryBasicList';
        this.apiKey = this.configService.get('GO_DATA_API_KEY');
    }
    async getInfoByCountryName(countryEnName) {
        if (!this.apiKey) {
            this.logger.warn('GO_DATA_API_KEY is not configured.');
            return null;
        }
        const url = `${this.baseUrl}?serviceKey=${this.apiKey}&countryEnName=${countryEnName}`;
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url));
            const jsonData = convert.xml2js(response.data, { compact: true });
            const item = jsonData?.response?.body?.items?.item;
            if (item && item.basic && item.basic._text) {
                return item.basic._text;
            }
            this.logger.warn(`No 'basic' info found for ${countryEnName} in API response.`);
            return '기본 정보를 불러올 수 없습니다.';
        }
        catch (error) {
            this.logger.error(`Failed to fetch country info for ${countryEnName}:`, error.message);
            return null;
        }
    }
};
exports.CountryInfoService = CountryInfoService;
exports.CountryInfoService = CountryInfoService = CountryInfoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], CountryInfoService);
//# sourceMappingURL=country-info.service.js.map