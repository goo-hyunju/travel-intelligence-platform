
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WeatherScraperService } from '../scraper/weather-scraper.service';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(
    private prisma: PrismaService,
    private scraper: WeatherScraperService,
  ) {}

  async getHistoricalWeather(destinationId: string, city: string, month: number) {
    const existingData = await this.prisma.historicalWeather.findUnique({
      where: { destinationId_month: { destinationId, month } },
    });
    if (existingData) return existingData;

    const scrapedData = await this.scraper.scrape(city, month);
    if (scrapedData) {
      return this.prisma.historicalWeather.create({
        data: { destinationId, month, ...scrapedData },
      });
    }
    return null;
  }
}