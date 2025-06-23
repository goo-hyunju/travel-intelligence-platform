
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DestinationResolver } from './destination.resolver';
import { DestinationService } from './destination.service';
import { PrismaModule } from '../prisma/prisma.module';
import { WeatherModule } from '../weather/weather.module';
import { CountryInfoModule } from '../country-info/country-info.module';
import { FlightScraperService } from '../scraper/flight-scraper.service';
import { AccommodationScraperService } from '../scraper/accommodation-scraper.service';
import { ActivityScraperService } from '../scraper/activity-scraper.service';
import { WeatherScraperService } from '../scraper/weather-scraper.service';

@Module({
  imports: [
    PrismaModule, 
    WeatherModule, 
    CountryInfoModule,
    HttpModule,
  ],
  providers: [
    DestinationResolver, 
    DestinationService,
    FlightScraperService,
    AccommodationScraperService,
    ActivityScraperService,
    WeatherScraperService, // 누락되었을 수 있는 프로바이더 추가
  ],
})
export class DestinationModule {}
