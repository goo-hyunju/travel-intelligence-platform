import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CountryInfoService } from './country-info.service';

@Module({
  imports: [HttpModule],
  providers: [CountryInfoService],
  exports: [CountryInfoService],
})
export class CountryInfoModule {}
