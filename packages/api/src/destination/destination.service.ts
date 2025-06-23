
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WeatherService } from '../weather/weather.service';
import { CountryInfoService } from '../country-info/country-info.service';
import { FlightScraperService } from '../scraper/flight-scraper.service';
import { AccommodationScraperService } from '../scraper/accommodation-scraper.service';
import { ActivityScraperService } from '../scraper/activity-scraper.service';

@Injectable()
export class DestinationService {
  private readonly logger = new Logger(DestinationService.name);

  constructor(
    private prisma: PrismaService,
    private weatherService: WeatherService,
    private countryInfoService: CountryInfoService,
    private flightScraperService: FlightScraperService,
    private accommodationScraperService: AccommodationScraperService,
    private activityScraperService: ActivityScraperService,
  ) {}

  async findAllForList() {
    return this.prisma.destination.findMany({
      select: { id: true, name: true, nameEn: true },
    });
  }

  async findManyByIds(ids: string[], month: number, startDate: string, endDate: string) {
    const destinations = await this.prisma.destination.findMany({
      where: { id: { in: ids } },
    });
    return Promise.all(
      destinations.map(dest => this.getEnrichedDestination(dest, month, startDate, endDate))
    );
  }

  private async getEnrichedDestination(destination: any, month: number, startDate: string, endDate: string) {
    const iataCode = destination.iataCode;

    const [
        weatherData, 
        countryInfo, 
        flightInfo, 
        accommodationInfo, 
        activitiesInfo
    ] = await Promise.all([
      this.weatherService.getHistoricalWeather(destination.id, destination.nameEn, month),
      this.countryInfoService.getInfoByCountryName(destination.nameEn),
      iataCode ? this.flightScraperService.scrapeInfo('ICN', iataCode, startDate, endDate) : Promise.resolve(null),
      this.accommodationScraperService.scrapeInfo(destination.nameEn),
      this.activityScraperService.scrapeInfo(destination.name),
    ]);
    
    const updatedDest = { ...destination };
    if (countryInfo) updatedDest.summary = countryInfo.replace(/<[^>]*>?/gm, ' ').replace(/ㅇ/g, '•');
    if (activitiesInfo) updatedDest.activities = activitiesInfo;

    // 최종 데이터 조합 및 계산
    updatedDest.weather = weatherData ? { text: weatherData.summary, icon: '❔' } : null;

    if (flightInfo) {
      updatedDest.flight = { time: flightInfo.time, cost: `약 ${flightInfo.price.toLocaleString()}원 ~` };
    }
    
    if (typeof updatedDest.expenses === 'object' && updatedDest.expenses !== null && 'breakdown' in updatedDest.expenses) {
        const expenses = updatedDest.expenses as { total: string, breakdown: Record<string, number> };
        if (flightInfo?.price) {
          expenses.breakdown.flight = flightInfo.price;
        }
        if (accommodationInfo?.averagePrice) {
            // [수정] 프론트엔드에서 받은 날짜로 실제 숙박일수를 계산합니다.
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const numberOfNights = diffDays > 0 ? diffDays : 1; // 최소 1박으로 계산

            expenses.breakdown.lodging = accommodationInfo.averagePrice * numberOfNights;
        }
        const newTotal = Object.values(expenses.breakdown).reduce((sum, val) => sum + val, 0);
        expenses.total = `약 ${newTotal.toLocaleString()}원`;
    }
    
    return updatedDest;
  }
}