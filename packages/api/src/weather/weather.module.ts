//
// 파일 경로: packages/api/src/weather/weather.module.ts
//
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WeatherService } from './weather.service';

@Module({
  imports: [HttpModule], // 외부 API 호출을 위해 HttpModule을 임포트합니다.
  providers: [WeatherService],
  exports: [WeatherService], // 다른 모듈에서 WeatherService를 사용할 수 있도록 공개합니다.
})
export class WeatherModule {}
