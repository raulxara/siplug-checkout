import type { ISubscriptionCyclesRepository } from '../../entities/subscription-cycles-repository.interface';
import { CreateSubscriptionCycleDtoIn } from './dtos/create-subscription-cycle.dto-in';
import { CreateSubscriptionCycleDtoOut } from './dtos/create-subscription-cycle.dto-out';
export declare class CreateSubscriptionCycleService {
    private readonly repository;
    constructor(repository: ISubscriptionCyclesRepository);
    exec(dtoIn: CreateSubscriptionCycleDtoIn): Promise<CreateSubscriptionCycleDtoOut>;
    private toRow;
    private requiredNumber;
    private requiredString;
}
