
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Browser, Page, chromium } from 'playwright';

@Injectable()
export class FlightScraperService implements OnModuleInit, OnModuleDestroy {
  private browser: Browser;
  private readonly logger = new Logger(FlightScraperService.name);

  async onModuleInit() {
    this.logger.log('Initializing Playwright Browser for flights...');
    this.browser = await chromium.launch({ headless: true });
  }

  async onModuleDestroy() {
    await this.browser?.close();
  }

  async scrapeInfo(iataCode: string, startDate: string, endDate: string): Promise<{ price: number; time: string } | null> {
    const url = `https://flight.naver.com/flights/international/ICN-${iataCode}-${startDate.replace(/-/g, '')}/${iataCode}-ICN-${endDate.replace(/-/g, '')}`;
    let page: Page | null = null;
    try {
      page = await this.browser.newPage();
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForSelector('.concurrent_ConcurrentItem__2lQVG', { timeout: 30000 });
      const flightData = await page.evaluate(() => {
        const item = document.querySelector('.concurrent_ConcurrentItem__2lQVG');
        if (!item) return null;
        const priceEl = item.querySelector('.item_num__3R0Vz');
        const timeEl = item.querySelector('.route_time__-2Z1T');
        return { priceText: priceEl?.textContent, timeText: timeEl?.textContent };
      });
      if (!flightData?.priceText) return null;
      const price = parseInt(flightData.priceText.replace(/[^0-9]/g, ''));
      return { price, time: flightData.timeText };
    } catch (error) {
      this.logger.error(`Failed to scrape flight for ${iataCode}:`, error.message);
      return null;
    } finally {
      await page?.close();
    }
  }
}