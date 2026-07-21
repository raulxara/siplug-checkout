import type { ClientRow } from '../../../entities/clients-repository.interface';
export declare class FindClientByUsernameDtoOut {
    readonly client: ClientRow;
    constructor(client: ClientRow);
}
