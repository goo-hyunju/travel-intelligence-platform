
//
// 6. 파일 경로: packages/api/src/scraper/flight-scraper.service.ts (신규 또는 수정)
//
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';

@Injectable()
export class FlightScraperService {
  private readonly logger = new Logger(FlightScraperService.name);

  constructor(private readonly httpService: HttpService) {}

  async scrapeFlightInfo(origin: string, destination: string): Promise<{ price: number; time: string } | null> {
    const url = `https://www.kayak.co.kr/flights/${origin}-${destination}/2025-07-15/2025-07-20?sort=price_a`;
    this.logger.log(`Scraping flight info from: ${url}`);
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36' },
        }),
      );
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
    } catch (error) {
      this.logger.error(`Failed to scrape flight info for ${origin}-${destination}:`, error.message);
      return null;
    }
  }
}
