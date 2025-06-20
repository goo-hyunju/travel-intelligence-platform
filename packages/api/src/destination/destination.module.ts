import { Module } from '@nestjs/common';
import { DestinationResolver } from './destination.resolver';
import { DestinationService } from './destination.service';
import { PrismaModule } from '../prisma/prisma.module';
import { WeatherModule } from '../weather/weather.module'; // WeatherModule 임포트

@Module({
  imports: [PrismaModule, WeatherModule], // WeatherModule 추가
  providers: [DestinationResolver, DestinationService],
})
export class DestinationModule {}
  