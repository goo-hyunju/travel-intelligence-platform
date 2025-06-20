//
// 3. 파일 경로: packages/api/src/country-info/country-info.service.ts (수정됨)
// 설명: API 응답이 문자열일 경우에만 XML로 파싱하도록 수정합니다.
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
        const responseData = response.data;
  
        let jsonData: any;

        // [수정] 응답 데이터가 문자열인 경우에만 XML 파싱을 시도합니다.
        if (typeof responseData === 'string' && responseData.startsWith('<?xml')) {
            jsonData = convert.xml2js(responseData, { compact: true });
        } else if (typeof responseData === 'object') {
            // 이미 JSON 객체로 파싱된 경우 그대로 사용합니다.
            jsonData = responseData;
        } else {
            this.logger.warn(`Received unexpected data type for ${countryEnName}: ${typeof responseData}`);
            return '국가 정보를 처리할 수 없습니다.';
        }
  
        const item = jsonData?.response?.body?.items?.item;
        
        if (item && item.basic && item.basic._text) {
          return item.basic._text;
        }
        
        const resultCode = jsonData?.response?.header?.resultCode?._text;
        if (resultCode && resultCode !== '00') {
            this.logger.warn(`API returned error code ${resultCode} for ${countryEnName}`);
        }

        return '기본 정보를 불러올 수 없습니다.';
  
      } catch (error) {
        this.logger.error(`Failed to fetch country info for ${countryEnName}:`, error.message);
        return null;
      }
    }
}
