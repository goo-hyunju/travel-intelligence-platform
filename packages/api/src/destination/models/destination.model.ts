//
// 파일 경로: packages/api/src/destination/models/destination.model.ts
// 설명: GraphQL API를 통해 새로운 데이터 필드들을 프론트엔드에 전달할 수 있도록 모델을 업데이트합니다.
//
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType({ description: '여행지 정보를 나타냅니다.' })
export class Destination {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  nameEn?: string;

  @Field({ nullable: true })
  summary?: string;
  
  @Field({ nullable: true })
  flightTime?: string;

  @Field({ nullable: true })
  recommendation?: string;

  @Field(() => GraphQLJSONObject, { nullable: true, description: '각 항목별 정규화된 점수' })
  scores?: any;

  @Field(() => GraphQLJSONObject, { nullable: true, description: '날씨 정보' })
  weather?: any;

  @Field(() => GraphQLJSONObject, { nullable: true, description: '항공편 정보' })
  flight?: any;

  @Field(() => GraphQLJSONObject, { nullable: true, description: '총 경비 및 세부 내역' })
  expenses?: any;

  @Field(() => [String], { nullable: 'itemsAndList', description: '주요 즐길 거리 목록' })
  activities?: string[];

  @Field(() => [String], { nullable: 'itemsAndList', description: '추천 숙소 목록' })
  accommodations?: string[];
}
