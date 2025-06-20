//
// 1. 파일 경로: packages/api/src/scraper/flight-scraper.service.ts (수정)
// 설명: 기존 카약 크롤러를 네이버 항공 크롤러로 교체합니다.
//
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';

@Injectable()
export class FlightScraperService {
  private readonly logger = new Logger(FlightScraperService.name);

  constructor(private readonly httpService: HttpService) {}

  async scrapeFlightInfo(origin: string, destination: string, startDate: string, endDate: string): Promise<{ price: number; time: string } | null> {
    // [수정] 네이버 항공 URL 형식으로 변경
    const formattedStartDate = startDate.replace(/-/g, '');
    const formattedEndDate = endDate.replace(/-/g, '');
    const url = `https://flight.naver.com/flights/international/${origin}-${destination}-${formattedStartDate}/${destination}-${origin}-${formattedEndDate}`;
    
    this.logger.log(`Scraping Naver flight info from: ${url}`);

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(url, { /* ... 헤더 설정 ... */ })
      );

      const $ = cheerio.load(data);
      
      // [수정] 네이버 항공의 클래스 선택자로 변경 (주의: 매우 불안정하며 변경될 수 있음)
      const priceText = $('.concurrent_ConcurrentItem__2lQVG .item_num__3R0Vz').first().text();
      const timeText = $('.concurrent_ConcurrentItem__2lQVG .route_time__-2Z1T').first().text();
      
      if (!priceText) {
          this.logger.warn(`Could not find price on Naver for ${origin}-${destination}.`);
          return null;
      }
      
      const price = parseInt(priceText.replace(/[^0-9]/g, ''));
      return { price, time: timeText };

    } catch (error) {
      this.logger.error(`Failed to scrape Naver flight info:`, error.message);
      return null;
    }
  }
}
