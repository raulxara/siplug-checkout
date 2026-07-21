import { CreatePermissionDtoOut } from '../../../modules/permissions/services/create-permission/dtos/create-permission.dto-out';

export class RegisterPermissionDtoOut {
  constructor(
    public readonly id: number,
    public readonly _id: string,
    public readonly officeId: string | null,
    public readonly name: string,
    public readonly slug: string,
    public readonly description: string | null,
    public readonly entity: string,
    public readonly action: string,
    public readonly config: Record<string, unknown> | null,
    public readonly changesHistory: Array<Record<string, unknown>> | null,
    public readonly status: string,
    public readonly createdAt: string | null,
    public readonly updatedAt: string | null,
  ) {}

  static fromCreatePermissionDtoOut(
    dtoOut: CreatePermissionDtoOut,
  ): RegisterPermissionDtoOut {
    return new RegisterPermissionDtoOut(
      dtoOut.id,
      dtoOut._id,
      dtoOut.officeId,
      dtoOut.name,
      dtoOut.slug,
      dtoOut.description,
      dtoOut.entity,
      dtoOut.action,
      dtoOut.config,
      dtoOut.changesHistory,
      dtoOut.status,
      dtoOut.createdAt,
      dtoOut.updatedAt,
    );
  }
}