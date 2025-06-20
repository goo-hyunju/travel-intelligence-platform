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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DestinationResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const destination_service_1 = require("./destination.service");
const destination_model_1 = require("./models/destination.model");
let DestinationResolver = class DestinationResolver {
    constructor(destinationService) {
        this.destinationService = destinationService;
    }
    async getAllDestinations() {
        return this.destinationService.findAllForList();
    }
    async getDestinationsByIds(ids, month, startDate, endDate) {
        if (ids.length === 0)
            return [];
        return this.destinationService.findManyByIds(ids, month, startDate, endDate);
    }
};
exports.DestinationResolver = DestinationResolver;
__decorate([
    (0, graphql_1.Query)(() => [destination_model_1.Destination], { name: 'allDestinations' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DestinationResolver.prototype, "getAllDestinations", null);
__decorate([
    (0, graphql_1.Query)(() => [destination_model_1.Destination], { name: 'destinationsByIds' }),
    __param(0, (0, graphql_1.Args)('ids', { type: () => [String] })),
    __param(1, (0, graphql_1.Args)('month', { type: () => graphql_1.Int })),
    __param(2, (0, graphql_1.Args)('startDate')),
    __param(3, (0, graphql_1.Args)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Number, String, String]),
    __metadata("design:returntype", Promise)
], DestinationResolver.prototype, "getDestinationsByIds", null);
exports.DestinationResolver = DestinationResolver = __decorate([
    (0, graphql_1.Resolver)(() => destination_model_1.Destination),
    __metadata("design:paramtypes", [destination_service_1.DestinationService])
], DestinationResolver);
//# sourceMappingURL=destination.resolver.js.map