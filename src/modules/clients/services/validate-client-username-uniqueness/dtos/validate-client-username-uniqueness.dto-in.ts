export class ValidateClientUsernameUniquenessDtoIn {
  public readonly username: string;

  constructor(username: string) {
    this.username = username;

    if (this.username.trim() === '') {
      throw new Error('username is required');
    }
  }
}