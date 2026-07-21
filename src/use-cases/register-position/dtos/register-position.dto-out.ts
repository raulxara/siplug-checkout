import { CreatePositionDtoOut } from '../../../modules/positions/services/create-position/dtos/create-position.dto-out';

export class RegisterPositionDtoOut {
  constructor(
    public readonly id: number,
    public readonly _id: string,
    public readonly officeId: string | null,
    public readonly name: string,
    public readonly slug: string,
    public readonly description: string | null,
    public readonly config: Record<string, unknown> | null,
    public readonly changesHistory: Array<Record<string, unknown>> | null,
    public readonly status: string,
    public readonly createdAt: string | null,
    public readonly updatedAt: string | null,
  ) {}

  static fromCreatePositionDtoOut(
    dtoOut: CreatePositionDtoOut,
  ): RegisterPositionDtoOut {
    return new RegisterPositionDtoOut(
      dtoOut.id,
      dtoOut._id,
      dtoOut.officeId,
      dtoOut.name,
      dtoOut.slug,
      dtoOut.description,
      dtoOut.config,
      dtoOut.changesHistory,
      dtoOut.status,
      dtoOut.createdAt,
      dtoOut.updatedAt,
    );
  }
}