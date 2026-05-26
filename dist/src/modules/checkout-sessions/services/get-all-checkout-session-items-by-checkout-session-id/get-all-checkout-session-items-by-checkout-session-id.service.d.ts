import type { ICheckoutSessionItemsRepository } from '../../entities/checkout-session-items-repository.interface';
import { GetAllCheckoutSessionItemsByCheckoutSessionIdDtoIn } from './dtos/get-all-checkout-session-items-by-checkout-session-id.dto-in';
import { GetAllCheckoutSessionItemsByCheckoutSessionIdDtoOut } from './dtos/get-all-checkout-session-items-by-checkout-session-id.dto-out';
export declare class GetAllCheckoutSessionItemsByCheckoutSessionIdService {
    private readonly repository;
    constructor(repository: ICheckoutSessionItemsRepository);
    exec(dtoIn: GetAllCheckoutSessionItemsByCheckoutSessionIdDtoIn): Promise<GetAllCheckoutSessionItemsByCheckoutSessionIdDtoOut>;
}
