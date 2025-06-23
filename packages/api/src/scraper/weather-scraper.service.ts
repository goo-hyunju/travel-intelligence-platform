
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';

@Injectable()
export class WeatherScraperService {
    private readonly logger = new Logger(WeatherScraperService.name);
    constructor(private readonly httpService: HttpService) {}

    async scrape(city: string, month: number): Promise<{ avgTemp: number; summary: string } | null> {
        const url = `https://www.timeanddate.com/weather/${city.toLowerCase()}/historic?month=${month}&year=2024`;
        this.logger.log(`Scraping weather: ${url}`);
        try {
            const { data } = await firstValueFrom(this.httpService.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }}));
            const $ = cheerio.load(data);
            const avgTempText = $('#wt-his-select > tbody > tr:nth-child(1) > td:nth-child(1)').text();
            const avgTemp = parseFloat(avgTempText.replace(/[^0-9.]/g, ''));
            const summary = `평균 기온 ${avgTemp}°C`;
            if (isNaN(avgTemp)) return null;
            return { avgTemp, summary };
        } catch (e) {
            this.logger.error(`Failed to scrape weather for ${city}`, e.message);
            return null;
        }
    }
}
