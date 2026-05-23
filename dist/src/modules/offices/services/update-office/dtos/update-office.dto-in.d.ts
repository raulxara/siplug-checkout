export declare class UpdateOfficeDtoIn {
    readonly _id: string;
    readonly name: string | null;
    readonly slug: string | null;
    readonly language: string | null;
    readonly currency: string | null;
    readonly addressStreet: string | null;
    readonly addressNumber: string | null;
    readonly addressComplement: string | null;
    readonly addressNeighborhood: string | null;
    readonly addressCity: string | null;
    readonly addressState: string | null;
    readonly addressCountry: string | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string | null;
    readonly source: string;
    constructor(params: {
        _id: string;
        name?: string | null;
        slug?: string | null;
        language?: string | null;
        currency?: string | null;
        addressStreet?: string | null;
        addressNumber?: string | null;
        addressComplement?: string | null;
        addressNeighborhood?: string | null;
        addressCity?: string | null;
        addressState?: string | null;
        addressCountry?: string | null;
        config?: Record<string, unknown> | null;
        status?: string | null;
        source?: string;
    });
}
