import { PrismaService } from '../prisma/prisma.service';
import { WeatherService } from '../weather/weather.service';
export declare class DestinationService {
    private prisma;
    private weatherService;
    private readonly logger;
    constructor(prisma: PrismaService, weatherService: WeatherService);
    findAll(): Promise<({
        id: string;
        name: string;
        nameEn: string | null;
        summary: string | null;
        flightTime: string | null;
        recommendation: string | null;
        scores: import(".prisma/client/runtime/library").JsonValue | null;
        weather: import(".prisma/client/runtime/library").JsonValue | null;
        flight: import(".prisma/client/runtime/library").JsonValue | null;
        expenses: import(".prisma/client/runtime/library").JsonValue | null;
        activities: string[];
        accommodations: string[];
    } | {
        weather: {
            text: string;
            icon: string;
        };
        id: string;
        name: string;
        nameEn: string | null;
        summary: string | null;
        flightTime: string | null;
        recommendation: string | null;
        scores: import(".prisma/client/runtime/library").JsonValue | null;
        flight: import(".prisma/client/runtime/library").JsonValue | null;
        expenses: import(".prisma/client/runtime/library").JsonValue | null;
        activities: string[];
        accommodations: string[];
    })[]>;
    findOneById(id: string): Promise<{
        id: string;
        name: string;
        nameEn: string | null;
        summary: string | null;
        flightTime: string | null;
        recommendation: string | null;
        scores: import(".prisma/client/runtime/library").JsonValue | null;
        weather: import(".prisma/client/runtime/library").JsonValue | null;
        flight: import(".prisma/client/runtime/library").JsonValue | null;
        expenses: import(".prisma/client/runtime/library").JsonValue | null;
        activities: string[];
        accommodations: string[];
    } | {
        weather: {
            text: string;
            icon: string;
        };
        id: string;
        name: string;
        nameEn: string | null;
        summary: string | null;
        flightTime: string | null;
        recommendation: string | null;
        scores: import(".prisma/client/runtime/library").JsonValue | null;
        flight: import(".prisma/client/runtime/library").JsonValue | null;
        expenses: import(".prisma/client/runtime/library").JsonValue | null;
        activities: string[];
        accommodations: string[];
    }>;
}
