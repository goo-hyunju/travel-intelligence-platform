import { DestinationService } from './destination.service';
export declare class DestinationResolver {
    private readonly destinationService;
    constructor(destinationService: DestinationService);
    getDestinations(): Promise<any[]>;
    getDestination(id: string): Promise<any>;
}
