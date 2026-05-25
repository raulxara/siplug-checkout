export class FindUserAccessCodeByCodeDtoIn {
  public readonly code: string;

  constructor(code: string) {
    this.code = code;

    if (this.code.trim() === '') {
      throw new Error('code is required');
    }
  }
}