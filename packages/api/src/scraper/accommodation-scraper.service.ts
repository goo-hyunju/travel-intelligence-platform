
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';

@Injectable()
export class AccommodationScraperService {
  private readonly logger = new Logger(AccommodationScraperService.name);
  constructor(private readonly httpService: HttpService) {}

  async scrapeInfo(destinationName: string): Promise<{ averagePrice: number } | null> {
    const url = `https://www.agoda.com/ko-kr/search?city=${destinationName}`;
    this.logger.log(`Scraping accommodation info from: ${url}`);
    try {
      const { data } = await firstValueFrom(this.httpService.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }));
      const $ = cheerio.load(data);
      const priceText = $('.PropertyCard__price .Price__value').first().text();
      if (!priceText) {
        this.logger.warn(`Could not find accommodation price for ${destinationName}`);
        return null;
      }
      const averagePrice = parseInt(priceText.replace(/[^0-9]/g, ''));
      this.logger.log(`Scraped Accommodation Price for ${destinationName}: ${averagePrice}`);
      return { averagePrice };
    } catch (error) {
      this.logger.error(`Failed to scrape accommodation info for ${destinationName}:`, error.message);
      return null;
    }
  }
}