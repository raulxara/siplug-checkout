export declare class CreateOfficeDtoIn {
    readonly name: string;
    readonly slug: string;
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
    readonly status: string;
    constructor(params: {
        name: string;
        slug: string;
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
        status?: string;
    });
}
