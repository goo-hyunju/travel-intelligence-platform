import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config'; // ConfigModule 임포트
import { PrismaModule } from './prisma/prisma.module';
import { DestinationModule } from './destination/destination.module';
import { WeatherModule } from './weather/weather.module'; // WeatherModule 임포트

@Module({
  imports: [
    // .env 파일을 전역으로 사용하기 위해 isGlobal 옵션을 true로 설정합니다.
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
    PrismaModule,
    DestinationModule,
    WeatherModule, // WeatherModule 추가
  ],
})
export class AppModule {}
