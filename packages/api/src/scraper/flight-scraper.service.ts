import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Browser, Page, chromium } from 'playwright';

@Injectable()
export class FlightScraperService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(FlightScraperService.name);
  private browser: Browser;

  async onModuleInit() {
    this.logger.log('Initializing Playwright Browser...');
    this.browser = await chromium.launch({ headless: true });
  }

  async onModuleDestroy() {
    this.logger.log('Closing Playwright Browser...');
    await this.browser.close();
  }

  async scrapeFlightInfo(origin: string, destination: string, startDate: string, endDate: string): Promise<{ price: number; time: string } | null> {
    const formattedStartDate = startDate.replace(/-/g, '');
    const formattedEndDate = endDate.replace(/-/g, '');
    const url = `https://flight.naver.com/flights/international/${origin}-${destination}-${formattedStartDate}/${destination}-${origin}-${formattedEndDate}`;
    
    let page: Page | null = null;
    this.logger.log(`Scraping Naver flight info from: ${url}`);

    try {
      page = await this.browser.newPage();
      // [수정] 타임아웃을 60초로 늘리고, 대기 전략을 수정합니다.
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

      // [수정] 결과가 나타날 때까지 최대 30초까지 기다립니다.
      await page.waitForSelector('.concurrent_ConcurrentItem__2lQVG', { timeout: 30000 });

      const flightData = await page.evaluate(() => {
        const item = document.querySelector('.concurrent_ConcurrentItem__2lQVG');
        if (!item) return null;
        
        const priceEl = item.querySelector('.item_num__3R0Vz');
        const timeEl = item.querySelector('.route_time__-2Z1T');

        return {
          priceText: priceEl ? priceEl.textContent : null,
          timeText: timeEl ? timeEl.textContent : null,
        };
      });

      if (!flightData || !flightData.priceText) {
        this.logger.warn(`Could not find price on Naver for ${origin}-${destination}.`);
        return null;
      }
      
      const price = parseInt(flightData.priceText.replace(/[^0-9]/g, ''));
      return { price, time: flightData.timeText };

    } catch (error) {
      this.logger.error(`Failed to scrape Naver flight info for ${origin}-${destination}:`, error.message);
      return null;
    } finally {
        if (page) await page.close();
    }
  }
}
