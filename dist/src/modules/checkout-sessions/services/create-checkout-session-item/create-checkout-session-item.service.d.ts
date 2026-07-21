import type { ICheckoutSessionItemsRepository } from '../../entities/checkout-session-items-repository.interface';
import { CreateCheckoutSessionItemDtoIn } from './dtos/create-checkout-session-item.dto-in';
import { CreateCheckoutSessionItemDtoOut } from './dtos/create-checkout-session-item.dto-out';
export declare class CreateCheckoutSessionItemService {
    private readonly repository;
    constructor(repository: ICheckoutSessionItemsRepository);
    exec(dtoIn: CreateCheckoutSessionItemDtoIn): Promise<CreateCheckoutSessionItemDtoOut>;
}
