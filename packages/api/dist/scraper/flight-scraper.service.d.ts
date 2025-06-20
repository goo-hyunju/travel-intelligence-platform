import { HttpService } from '@nestjs/axios';
export declare class FlightScraperService {
    private readonly httpService;
    private readonly logger;
    constructor(httpService: HttpService);
    scrapeFlightInfo(origin: string, destination: string, startDate: string, endDate: string): Promise<{
        price: number;
        time: string;
    } | null>;
}
