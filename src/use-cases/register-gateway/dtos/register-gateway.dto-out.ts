import { CreateGatewayDtoOut } from '../../../modules/gateways/services/create-gateway/dtos/create-gateway.dto-out';

export class RegisterGatewayDtoOut {
  constructor(
    public readonly id: number,
    public readonly _id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly provider: string,
    public readonly description: string | null,
    public readonly config: Record<string, unknown> | null,
    public readonly changesHistory: Array<Record<string, unknown>> | null,
    public readonly status: string,
    public readonly createdAt: string | null,
    public readonly updatedAt: string | null,
  ) {}

  static fromCreateGatewayDtoOut(
    dtoOut: CreateGatewayDtoOut,
  ): RegisterGatewayDtoOut {
    return new RegisterGatewayDtoOut(
      dtoOut.id,
      dtoOut._id,
      dtoOut.name,
      dtoOut.slug,
      dtoOut.provider,
      dtoOut.description,
      dtoOut.config,
      dtoOut.changesHistory,
      dtoOut.status,
      dtoOut.createdAt,
      dtoOut.updatedAt,
    );
  }
}