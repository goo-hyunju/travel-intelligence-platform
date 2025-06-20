import { DestinationService } from './destination.service';
export declare class DestinationResolver {
    private readonly destinationService;
    constructor(destinationService: DestinationService);
    getAllDestinations(): Promise<any>;
    getDestinationsByIds(ids: string[], month: number, startDate: string, endDate: string): Promise<any>;
}
