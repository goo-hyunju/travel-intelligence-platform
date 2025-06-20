
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as convert from 'xml-js';

@Injectable()
export class CountryInfoService {
  private readonly logger = new Logger(CountryInfoService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'http://apis.data.go.kr/1262000/CountryBasicService/getCountryBasicList';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('GO_DATA_API_KEY');
  }

  async getInfoByCountryName(countryEnName: string): Promise<string | null> {
    if (!this.apiKey) {
      this.logger.warn('GO_DATA_API_KEY is not configured.');
      return null;
    }
    const url = `${this.baseUrl}?serviceKey=${this.apiKey}&countryEnName=${countryEnName}`;
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const jsonData: any = convert.xml2js(response.data, { compact: true });
      
      const item = jsonData?.response?.body?.items?.item;
      if (item && item.basic && item.basic._text) {
        return item.basic._text;
      }

      this.logger.warn(`No 'basic' info found for ${countryEnName} in API response.`);
      return '기본 정보를 불러올 수 없습니다.';
    } catch (error) {
      this.logger.error(`Failed to fetch country info for ${countryEnName}:`, error.message);
      return null;
    }
  }
}