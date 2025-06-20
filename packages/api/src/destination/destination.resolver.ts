import { Resolver, Query, Args } from '@nestjs/graphql';
import { DestinationService } from './destination.service';
import { Destination } from './models/destination.model';

@Resolver(() => Destination)
export class DestinationResolver {
  constructor(private readonly destinationService: DestinationService) {}

  @Query(() => [Destination], { name: 'destinations', description: '모든 여행지 목록을 가져옵니다.' })
  async getDestinations() {
    return this.destinationService.findAll();
  }

  @Query(() => Destination, { name: 'destination', nullable: true, description: 'ID로 특정 여행지 정보를 가져옵니다.' })
  async getDestination(@Args('id') id: string) {
    return this.destinationService.findOneById(id);
  }
}