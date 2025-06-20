//
// 파일 경로: packages/api/src/country-info/country-info.service.ts (수정됨)
//
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
    // .env 파일에서 공공데이터포털 API 키를 가져옵니다.
    this.apiKey = this.configService.get<string>('GO_DATA_API_KEY');
  }

  /**
   * 국가 영문 이름으로 기본 정보를 조회합니다.
   * @param countryEnName 영문 국가명 (e.g., "Thailand")
   */
  async getInfoByCountryName(countryEnName: string): Promise<string | null> {
    if (!this.apiKey) {
      this.logger.warn('GO_DATA_API_KEY is not configured.');
      return null;
    }

    const url = `${this.baseUrl}?serviceKey=${this.apiKey}&countryEnName=${countryEnName}`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const xmlData = response.data;
      const jsonData: any = convert.xml2js(xmlData, { compact: true });
      
      // [수정됨] API 응답 구조를 안전하게 확인합니다.
      const item = jsonData?.response?.body?.items?.item;

      if (item && item.basic && item.basic._text) {
        return item.basic._text;
      }

      this.logger.warn(`No 'basic' info found for ${countryEnName} in API response.`);
      return '기본 정보를 불러올 수 없습니다.';

    } catch (error) {
      this.logger.error(`Failed to fetch country info for ${countryEnName}:`, error.response?.data || error.message);
      return null;
    }
  }
}