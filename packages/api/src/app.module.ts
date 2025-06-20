
//
// 9. 파일 경로: packages/api/src/app.module.ts (수정)
//
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { DestinationModule } from './destination/destination.module';
import { WeatherModule } from './weather/weather.module';
import { CountryInfoModule } from './country-info/country-info.module';
import { FlightScraperModule } from './scraper/flight-scraper.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
    PrismaModule,
    DestinationModule,
    WeatherModule,
    CountryInfoModule,
    FlightScraperModule,
  ],
})
export class AppModule {}
