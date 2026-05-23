export declare class CreateProfileDtoIn {
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
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
    readonly status: string;
    constructor(params: {
        firstName: string;
        lastName: string;
        email: string;
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
        status?: string;
    });
}
