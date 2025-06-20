import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WeatherService } from '../weather/weather.service'; // WeatherService 임포트

@Injectable()
export class DestinationService {
  private readonly logger = new Logger(DestinationService.name);

  constructor(
    private prisma: PrismaService,
    private weatherService: WeatherService, // WeatherService 주입
  ) {}

  async findAll() {
    const destinations = await this.prisma.destination.findMany();

    // 각 여행지의 날씨 정보를 실시간으로 가져와서 덮어씁니다.
    const enrichedDestinations = await Promise.all(destinations.map(async (dest) => {
      const liveWeather = await this.weatherService.getWeatherByCityName(dest.nameEn);
      
      // liveWeather가 성공적으로 받아와졌을 때만 DB 데이터를 덮어씁니다.
      if (liveWeather) {
        this.logger.log(`Fetched live weather for ${dest.name}`);
        return { ...dest, weather: liveWeather };
      }
      
      // 실패 시에는 원래 DB에 있던 데이터를 그대로 사용합니다.
      return dest;
    }));
    
    return enrichedDestinations;
  }

  // [수정됨] 빠져있던 findOneById 메소드를 추가합니다.
  async findOneById(id: string) {
    const destination = await this.prisma.destination.findUnique({
      where: { id },
    });

    if (!destination) {
      return null;
    }

    // 단일 조회 시에도 실시간 날씨 정보를 가져옵니다.
    const liveWeather = await this.weatherService.getWeatherByCityName(destination.nameEn);

    if (liveWeather) {
      this.logger.log(`Fetched live weather for ${destination.name}`);
      return { ...destination, weather: liveWeather };
    }

    return destination;
  }
}
