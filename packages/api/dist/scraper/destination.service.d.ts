import { PrismaService } from '../prisma/prisma.service';
import { WeatherService } from '../weather/weather.service';
import { CountryInfoService } from '../country-info/country-info.service';
import { FlightScraperService } from '../scraper/flight-scraper.service';
export declare class DestinationService {
    private prisma;
    private weatherService;
    private countryInfoService;
    private flightScraperService;
    private readonly logger;
    constructor(prisma: PrismaService, weatherService: WeatherService, countryInfoService: CountryInfoService, flightScraperService: FlightScraperService);
    findAll(): Promise<any[]>;
    findOneById(id: string): Promise<any>;
    private enrichDestination;
}
