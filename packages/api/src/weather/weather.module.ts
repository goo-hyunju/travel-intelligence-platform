
// 1. 파일 경로: packages/api/src/weather/weather.module.ts (수정됨)
// 설명: WeatherService가 PrismaService를 사용할 수 있도록 PrismaModule을 임포트합니다.
//
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WeatherService } from './weather.service';
import { PrismaModule } from '../prisma/prisma.module'; // PrismaModule 임포트
import { WeatherScraperService } from '../scraper/weather-scraper.service';

@Module({
  imports: [
    PrismaModule, // [수정] PrismaModule을 임포트하여 PrismaService를 주입받을 수 있게 합니다.
    HttpModule
  ],
  providers: [WeatherService, WeatherScraperService],
  exports: [WeatherService],
})
export class WeatherModule {}
