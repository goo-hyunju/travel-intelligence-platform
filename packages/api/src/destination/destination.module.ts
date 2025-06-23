
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

@Module({
  imports: [PrismaModule, WeatherModule, CountryInfoModule, HttpModule],
  providers: [
    DestinationResolver, 
    DestinationService,
    FlightScraperService,
    AccommodationScraperService,
    ActivityScraperService,
  ],
})
export class DestinationModule {}
