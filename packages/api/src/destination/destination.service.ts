
//
// 2. 파일 경로: packages/api/src/destination/destination.service.ts
// 설명: 받아온 날짜를 각 하위 서비스(날씨, 스크레이퍼)에 전달합니다.
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

  async findAll(month: number, startDate: string, endDate: string) {
    const destinations = await this.prisma.destination.findMany();
    return Promise.all(
      destinations.map(dest => this.enrichDestination(dest, month, startDate, endDate))
    );
  }

  async findOneById(id: string, month: number, startDate: string, endDate: string) {
    const destination = await this.prisma.destination.findUnique({ where: { id } });
    if (!destination) return null;
    return this.enrichDestination(destination, month, startDate, endDate);
  }

  private async enrichDestination(destination: any, month: number, startDate: string, endDate: string) {
    // IATA 공항 코드는 DB에서 관리하는 것이 더 좋지만, 여기서는 간단히 맵으로 관리합니다.
    const iataMap: { [key: string]: string } = {
      cebu: 'CEB',
      nhatrang: 'CXR',
      danang: 'DAD',
      fukuoka: 'FUK',
      sapporo: 'CTS',
      bangkok: 'BKK',
    };
    const iataCode = iataMap[destination.id];

    // 날씨, 국가정보, 항공권 정보를 병렬로 동시에 요청합니다.
    const [historicalWeather, countryInfo, flightInfo] = await Promise.all([
      this.weatherService.getHistoricalWeatherForMonth(destination.nameEn, month),
      this.countryInfoService.getInfoByCountryName(destination.nameEn),
      iataCode ? this.flightScraperService.scrapeFlightInfo('ICN', iataCode, startDate, endDate) : Promise.resolve(null),
    ]);
    
    // 조회된 데이터를 기존 객체에 덮어씁니다.
    const updatedDest = { ...destination };
    if (historicalWeather) updatedDest.weather = historicalWeather;
    if (countryInfo) updatedDest.summary = countryInfo.replace(/<[^>]*>?/gm, ' ').replace(/ㅇ/g, '•');

    if (flightInfo) {
      updatedDest.flight = { time: flightInfo.time, cost: `약 ${flightInfo.price.toLocaleString()}원 ~` };
      // JSON 객체인 expenses 필드를 안전하게 수정합니다.
      if (typeof updatedDest.expenses === 'object' && updatedDest.expenses !== null && 'breakdown' in updatedDest.expenses) {
          const expenses = updatedDest.expenses as { breakdown: { flight: number } };
          expenses.breakdown.flight = flightInfo.price;
      }
    }
    
    return updatedDest;
  }
}
