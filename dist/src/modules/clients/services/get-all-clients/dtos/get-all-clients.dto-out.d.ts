import type { ClientRow } from '../../../entities/clients-repository.interface';
export declare class GetAllClientsDtoOut {
    readonly items: ClientRow[];
    readonly total: number;
    constructor(items: ClientRow[], total: number);
}
