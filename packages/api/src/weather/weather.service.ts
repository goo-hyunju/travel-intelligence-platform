// ===================================================================================

//
// 파일 경로: packages/api/src/weather/weather.service.ts
//
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // .env 파일에서 API 키를 안전하게 가져옵니다.
    this.apiKey = this.configService.get<string>('OPENWEATHERMAP_API_KEY');
  }

  // 도시의 영문 이름으로 날씨 정보를 가져옵니다.
  async getWeatherByCityName(cityName: string): Promise<{ text: string; icon: string } | null> {
    if (!this.apiKey) {
      this.logger.warn('OpenWeatherMap API key is not configured.');
      return null;
    }

    // 도시 이름에 맞는 위도, 경도를 찾습니다 (향후 DB에서 관리).
    const coords = this.getCoordinatesForCity(cityName);
    if (!coords) {
      this.logger.warn(`Coordinates not found for city: ${cityName}`);
      return null;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${this.apiKey}&units=metric&lang=kr`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const data = response.data;
      
      const weatherText = `${data.weather[0].description}, 현재 ${data.main.temp.toFixed(1)}°C (체감 ${data.main.feels_like.toFixed(1)}°C)`;
      const weatherIcon = this.getWeatherIcon(data.weather[0].id);

      return { text: weatherText, icon: weatherIcon };
    } catch (error) {
      this.logger.error(`Failed to fetch weather for ${cityName}:`, error.response?.data || error.message);
      return null;
    }
  }

  // 간단한 도시 좌표 매핑 (임시)
  private getCoordinatesForCity(cityName: string): { lat: number; lon: number } | null {
    const cityMap: Record<string, { lat: number; lon: number }> = {
      'Cebu': { lat: 10.3157, lon: 123.8854 },
      'Nha Trang': { lat: 12.2388, lon: 109.1967 },
      'Da Nang': { lat: 16.0544, lon: 108.2022 },
      'Fukuoka': { lat: 33.5904, lon: 130.4017 },
      'Sapporo': { lat: 43.0618, lon: 141.3545 },
      'Bangkok': { lat: 13.7563, lon: 100.5018 }, // 방콕 추가!
    };
    const key = Object.keys(cityMap).find(k => cityName.toLowerCase().includes(k.toLowerCase()));
    return key ? cityMap[key] : null;
  }
  
  // 날씨 코드에 맞는 아이콘 반환
  private getWeatherIcon(weatherId: number): string {
      if (weatherId >= 200 && weatherId < 300) return '⛈️'; // 뇌우
      if (weatherId >= 300 && weatherId < 400) return '💧'; // 이슬비
      if (weatherId >= 500 && weatherId < 600) return '🌧️'; // 비
      if (weatherId >= 600 && weatherId < 700) return '❄️'; // 눈
      if (weatherId >= 700 && weatherId < 800) return '🌫️'; // 안개 등
      if (weatherId === 800) return '☀️'; // 맑음
      if (weatherId === 801) return '🌤️'; // 구름 조금
      if (weatherId === 802) return '🌥️'; // 구름 낌
      if (weatherId > 802) return '☁️'; // 흐림
      return '🌍'; // 기본
  }
}
