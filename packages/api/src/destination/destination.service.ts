//
// 3. 파일 경로: packages/api/src/destination/destination.service.ts (수정됨)
// 설명: 오류 해결을 위해 누락되었던 findAllForList와 findManyByIds 메소드를 추가합니다.
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
  
    // [추가됨] 도시 선택기 목록을 위한 간단한 조회 메소드
    async findAllForList() {
      return this.prisma.destination.findMany({
        select: { id: true, name: true, nameEn: true },
      });
    }

    // [추가됨] ID 배열로 상세 정보를 조회하는 메소드
    async findManyByIds(ids: string[], month: number, startDate: string, endDate: string) {
      const destinations = await this.prisma.destination.findMany({
        where: { id: { in: ids } },
      });
      return Promise.all(
        destinations.map(dest => this.enrichDestination(dest, month, startDate, endDate))
      );
    }
  
    private async enrichDestination(destination: any, month: number, startDate: string, endDate: string) {
      const iataMap: { [key: string]: string } = {
        cebu: 'CEB', nhatrang: 'CXR', danang: 'DAD',
        fukuoka: 'FUK', sapporo: 'CTS', bangkok: 'BKK', osaka: 'KIX'
      };
      const iataCode = iataMap[destination.id];
  
      const [historicalWeather, countryInfo, flightInfo] = await Promise.all([
        this.weatherService.getHistoricalWeatherForMonth(destination.nameEn, month),
        this.countryInfoService.getInfoByCountryName(destination.nameEn),
        iataCode ? this.flightScraperService.scrapeFlightInfo('ICN', iataCode, startDate, endDate) : Promise.resolve(null),
      ]);
      
      const updatedDest = { ...destination };
      if (historicalWeather) updatedDest.weather = historicalWeather;
      if (countryInfo) updatedDest.summary = countryInfo.replace(/<[^>]*>?/gm, ' ').replace(/ㅇ/g, '•');
  
      if (flightInfo && flightInfo.price) {
        updatedDest.flight = { time: flightInfo.time, cost: `약 ${flightInfo.price.toLocaleString()}원 ~` };
        if (typeof updatedDest.expenses === 'object' && updatedDest.expenses !== null && 'breakdown' in updatedDest.expenses) {
            const expenses = updatedDest.expenses as { breakdown: { flight: number } };
            expenses.breakdown.flight = flightInfo.price;
        }
      }
      
      return updatedDest;
    }
}
