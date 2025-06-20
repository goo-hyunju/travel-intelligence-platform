
//
// 7. 파일 경로: packages/api/src/destination/destination.module.ts (수정)
//
import { Module } from '@nestjs/common';
import { DestinationResolver } from './destination.resolver';
import { DestinationService } from './destination.service';
import { PrismaModule } from '../prisma/prisma.module';
import { WeatherModule } from '../weather/weather.module';
import { CountryInfoModule } from '../country-info/country-info.module';
import { FlightScraperModule } from '../scraper/flight-scraper.module';

@Module({
  imports: [PrismaModule, WeatherModule, CountryInfoModule, FlightScraperModule],
  providers: [DestinationResolver, DestinationService],
})
export class DestinationModule {}
