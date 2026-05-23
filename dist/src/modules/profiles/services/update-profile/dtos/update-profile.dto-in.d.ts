export declare class UpdateProfileDtoIn {
    readonly _id: string;
    readonly firstName: string | null;
    readonly lastName: string | null;
    readonly email: string | null;
    readonly phone: string | null;
    readonly documentType: string | null;
    readonly documentValue: string | null;
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
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        phone?: string | null;
        documentType?: string | null;
        documentValue?: string | null;
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
