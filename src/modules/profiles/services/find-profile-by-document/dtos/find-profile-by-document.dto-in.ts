export class FindProfileByDocumentDtoIn {
  public readonly documentType: string;
  public readonly documentValue: string;

  constructor(params: { documentType: string; documentValue: string }) {
    this.documentType = params.documentType;
    this.documentValue = params.documentValue;

    if (this.documentType.trim() === '') {
      throw new Error('documentType is required');
    }

    if (this.documentValue.trim() === '') {
      throw new Error('documentValue is required');
    }
  }
}