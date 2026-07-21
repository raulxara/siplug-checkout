import { ProfileRow } from '../../../entities/profiles-repository.interface';
export declare class GetAllProfilesDtoOut {
    readonly items: ProfileRow[];
    readonly total: number;
    constructor(items: ProfileRow[], total: number);
}
