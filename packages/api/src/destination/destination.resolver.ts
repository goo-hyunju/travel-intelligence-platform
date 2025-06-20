// 2. 파일 경로: packages/api/src/destination/destination.resolver.ts
// 설명: 새로운 쿼리(allDestinations, destinationsByIds)를 정의합니다.
//
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { DestinationService } from './destination.service';
import { Destination } from './models/destination.model';

@Resolver(() => Destination)
export class DestinationResolver {
  constructor(private readonly destinationService: DestinationService) {}

  @Query(() => [Destination], { name: 'allDestinations' })
  async getAllDestinations() {
    return this.destinationService.findAllForList();
  }

  @Query(() => [Destination], { name: 'destinationsByIds' })
  async getDestinationsByIds(
    @Args('ids', { type: () => [String] }) ids: string[],
    @Args('month', { type: () => Int }) month: number,
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string,
  ) {
    if (ids.length === 0) return [];
    return this.destinationService.findManyByIds(ids, month, startDate, endDate);
  }
}