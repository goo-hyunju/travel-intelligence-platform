import { DestinationService } from './destination.service';
export declare class DestinationResolver {
    private readonly destinationService;
    constructor(destinationService: DestinationService);
    getDestinations(): Promise<({
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
    getDestination(id: string): Promise<{
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
