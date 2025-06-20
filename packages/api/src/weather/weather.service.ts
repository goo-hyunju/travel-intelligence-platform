//
// 파일 경로: packages/api/src/weather/weather.service.ts (현재 최신 버전)
// 설명: 과거 날씨 데이터를 시뮬레이션하여 제공합니다.
//
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  async getHistoricalWeatherForMonth(cityName: string, month: number): Promise<{ text: string; icon: string } | null> {
    this.logger.log(`Fetching historical weather for ${cityName} for month ${month}`);
    const historicalData: Record<string, Record<number, { text: string; icon: string }>> = {
      'Cebu': { 7: { text: "우기 시즌. 평균 28°C, 잦은 스콜성 소나기.", icon: '🌦️' } },
      'Nha Trang': { 7: { text: "건기 시즌. 평균 29°C, 맑고 화창함.", icon: '☀️' } },
      'Da Nang': { 7: { text: "가장 더운 달. 평균 30°C, 매우 덥고 습함.", icon: '🥵' } },
      'Fukuoka': { 7: { text: "장마 끝, 무더위 시작. 평균 28°C, 습함.", icon: '♨️' } },
      'Sapporo': { 7: { text: "가장 쾌적한 달. 평균 21°C, 시원함.", icon: '🌸' } },
      'Bangkok': { 7: { text: "우기 시즌. 평균 29°C, 비가 잦음.", icon: '🌧️' } }
    };
    const cityKey = Object.keys(historicalData).find(k => cityName.toLowerCase().includes(k.toLowerCase()));
    if (cityKey && historicalData[cityKey][month]) {
      return historicalData[cityKey][month];
    }
    return null;
  }
}