export declare class WeatherService {
    private readonly logger;
    getHistoricalWeatherForMonth(cityName: string, month: number): Promise<{
        text: string;
        icon: string;
    } | null>;
}
