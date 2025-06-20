"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Destination = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_type_json_1 = require("graphql-type-json");
let Destination = class Destination {
};
exports.Destination = Destination;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Destination.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Destination.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Destination.prototype, "nameEn", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Destination.prototype, "summary", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Destination.prototype, "flightTime", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Destination.prototype, "recommendation", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_type_json_1.GraphQLJSONObject, { nullable: true, description: '각 항목별 정규화된 점수' }),
    __metadata("design:type", Object)
], Destination.prototype, "scores", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_type_json_1.GraphQLJSONObject, { nullable: true, description: '날씨 정보' }),
    __metadata("design:type", Object)
], Destination.prototype, "weather", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_type_json_1.GraphQLJSONObject, { nullable: true, description: '항공편 정보' }),
    __metadata("design:type", Object)
], Destination.prototype, "flight", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_type_json_1.GraphQLJSONObject, { nullable: true, description: '총 경비 및 세부 내역' }),
    __metadata("design:type", Object)
], Destination.prototype, "expenses", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: 'itemsAndList', description: '주요 즐길 거리 목록' }),
    __metadata("design:type", Array)
], Destination.prototype, "activities", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: 'itemsAndList', description: '추천 숙소 목록' }),
    __metadata("design:type", Array)
], Destination.prototype, "accommodations", void 0);
exports.Destination = Destination = __decorate([
    (0, graphql_1.ObjectType)({ description: '여행지 정보를 나타냅니다.' })
], Destination);
//# sourceMappingURL=destination.model.js.map