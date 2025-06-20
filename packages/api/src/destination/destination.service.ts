
//
// 8. 파일 경로: packages/api/src/destination/destination.service.ts (수정)
//
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WeatherService } from '../weather/weather.service';
import { CountryInfoService } from '../country-info/country-info.service';
import { FlightScraperService } from '../scraper/flight-scraper.service';

@Injectable()
export class DestinationService {
  private readonly logger = new Logger(DestinationService.name);

  constructor(
    private prisma: PrismaService,
    private weatherService: WeatherService,
    private countryInfoService: CountryInfoService,
    private flightScraperService: FlightScraperService,
  ) {}

  async findAll() {
    const destinations = await this.prisma.destination.findMany();
    return Promise.all(destinations.map(dest => this.enrichDestination(dest)));
  }

  async findOneById(id: string) {
    const destination = await this.prisma.destination.findUnique({ where: { id } });
    if (!destination) return null;
    return this.enrichDestination(destination);
  }

  private async enrichDestination(destination: any) {
    const targetMonth = 7;
    const iataMap: { [key: string]: string } = {
      cebu: 'CEB', nhatrang: 'CXR', danang: 'DAD',
      fukuoka: 'FUK', sapporo: 'CTS', bangkok: 'BKK',
    };
    const iataCode = iataMap[destination.id];

    const [historicalWeather, countryInfo, flightInfo] = await Promise.all([
      this.weatherService.getHistoricalWeatherForMonth(destination.nameEn, targetMonth),
      this.countryInfoService.getInfoByCountryName(destination.nameEn),
      iataCode ? this.flightScraperService.scrapeFlightInfo('ICN', iataCode) : Promise.resolve(null),
    ]);
    
    const updatedDest = { ...destination };
    if (historicalWeather) updatedDest.weather = historicalWeather;
    if (countryInfo) updatedDest.summary = countryInfo.replace(/<[^>]*>?/gm, ' ').replace(/ㅇ/g, '•');
    if (flightInfo) {
      updatedDest.flight = { time: flightInfo.time, cost: `약 ${flightInfo.price.toLocaleString()}원 ~` };
      if (typeof updatedDest.expenses === 'object' && updatedDest.expenses !== null && 'breakdown' in updatedDest.expenses) {
        const expenses = updatedDest.expenses as { breakdown: { flight: number } };
        expenses.breakdown.flight = flightInfo.price;
      }
    }
    
    return updatedDest;
  }
}