import type { ICheckoutSessionsRepository } from '../../entities/checkout-sessions-repository.interface';
import { GetAllCheckoutSessionsByOfficeIdDtoIn } from './dtos/get-all-checkout-sessions-by-office-id.dto-in';
import { GetAllCheckoutSessionsByOfficeIdDtoOut } from './dtos/get-all-checkout-sessions-by-office-id.dto-out';
export declare class GetAllCheckoutSessionsByOfficeIdService {
    private readonly repository;
    constructor(repository: ICheckoutSessionsRepository);
    exec(dtoIn: GetAllCheckoutSessionsByOfficeIdDtoIn): Promise<GetAllCheckoutSessionsByOfficeIdDtoOut>;
}
