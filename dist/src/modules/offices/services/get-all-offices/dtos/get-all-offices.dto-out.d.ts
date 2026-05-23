import { OfficeRow } from '../../../entities/offices-repository.interface';
export declare class GetAllOfficesDtoOut {
    readonly items: OfficeRow[];
    readonly total: number;
    constructor(items: OfficeRow[], total: number);
}
