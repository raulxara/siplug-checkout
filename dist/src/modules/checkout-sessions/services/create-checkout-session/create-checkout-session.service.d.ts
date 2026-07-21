import type { ICheckoutSessionsRepository } from '../../entities/checkout-sessions-repository.interface';
import { CreateCheckoutSessionDtoIn } from './dtos/create-checkout-session.dto-in';
import { CreateCheckoutSessionDtoOut } from './dtos/create-checkout-session.dto-out';
export declare class CreateCheckoutSessionService {
    private readonly repository;
    constructor(repository: ICheckoutSessionsRepository);
    exec(dtoIn: CreateCheckoutSessionDtoIn): Promise<CreateCheckoutSessionDtoOut>;
}
