
//
// 2. 파일 경로: packages/api/src/destination/destination.resolver.ts (수정)
// 설명: 새로운 쿼리(allDestinations, destinationsByIds)를 정의합니다.
//
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { DestinationService } from './destination.service';
import { Destination } from './models/destination.model';

@Resolver(() => Destination)
export class DestinationResolver {
  constructor(private readonly destinationService: DestinationService) {}

  // [신규] 프론트엔드 도시 선택기에 전체 목록을 제공하기 위한 쿼리
  @Query(() => [Destination], { name: 'allDestinations' })
  async getAllDestinations() {
    return this.destinationService.findAllForList();
  }

  // [수정] 기존 destinations 쿼리를 ID 배열을 받는 destinationsByIds로 변경
  @Query(() => [Destination], { name: 'destinationsByIds' })
  async getDestinationsByIds(
    @Args('ids', { type: () => [String] }) ids: string[],
    @Args('month', { type: () => Int }) month: number,
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string,
  ) {
    if (ids.length === 0) return []; // ID가 없으면 빈 배열 반환
    return this.destinationService.findManyByIds(ids, month, startDate, endDate);
  }
}