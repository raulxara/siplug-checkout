import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';

@Injectable()
export class GenerateUserCustomerTokenService {
  exec(): string {
    return randomBytes(32).toString('hex');
  }
}