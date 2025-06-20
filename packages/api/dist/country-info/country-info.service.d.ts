import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class CountryInfoService {
    private readonly httpService;
    private readonly configService;
    private readonly logger;
    private readonly apiKey;
    private readonly baseUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    getInfoByCountryName(countryEnName: string): Promise<string | null>;
}
