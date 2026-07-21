import type { ClientRow } from '../../../entities/clients-repository.interface';
export declare class FindClientByUniqueIdDtoOut {
    readonly client: ClientRow;
    constructor(client: ClientRow);
}
