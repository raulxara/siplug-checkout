import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class HashPasswordService {
  async exec(password: string): Promise<string> {
    if (password.trim() === '') {
      throw new Error('password is required');
    }

    return bcrypt.hash(password, 10);
  }
}