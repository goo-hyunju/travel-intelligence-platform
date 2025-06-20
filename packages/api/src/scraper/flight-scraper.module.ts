//
// 5. 파일 경로: packages/api/src/scraper/flight-scraper.module.ts (신규 또는 수정)
//
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FlightScraperService } from './flight-scraper.service';

@Module({
  imports: [HttpModule],
  providers: [FlightScraperService],
  exports: [FlightScraperService],
})
export class FlightScraperModule {}
