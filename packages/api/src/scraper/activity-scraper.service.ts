
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';

@Injectable()
export class ActivityScraperService {
    private readonly logger = new Logger(ActivityScraperService.name);
    constructor(private readonly httpService: HttpService) {}

    async scrapeInfo(destinationName: string): Promise<string[] | null> {
        const url = `https://www.google.com/search?q=${encodeURIComponent(destinationName + ' 꼭 해야할 것')}`;
        try {
            const { data } = await firstValueFrom(this.httpService.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }));
            const $ = cheerio.load(data);
            const activities: string[] = [];
            $('h3.LC20lb').each((i, el) => {
                if (i < 5) activities.push($(el).text());
            });
            return activities.length > 0 ? activities : null;
        } catch (error) {
            this.logger.error(`Failed to scrape activities for ${destinationName}:`, error.message);
            return null;
        }
    }
}
