import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class WeatherService {
    private readonly httpService;
    private readonly configService;
    private readonly logger;
    private readonly apiKey;
    constructor(httpService: HttpService, configService: ConfigService);
    getWeatherByCityName(cityName: string): Promise<{
        text: string;
        icon: string;
    } | null>;
    private getCoordinatesForCity;
    private getWeatherIcon;
}
