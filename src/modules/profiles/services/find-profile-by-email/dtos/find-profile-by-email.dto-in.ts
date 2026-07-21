export class FindProfileByEmailDtoIn {
  public readonly email: string;

  constructor(email: string) {
    this.email = email;

    if (this.email.trim() === '') {
      throw new Error('email is required');
    }
  }
}