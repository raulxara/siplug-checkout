import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateUserAccessCodeService {
  exec(length = 6): string {
    const normalizedLength = length > 0 ? length : 6;
    const min = 10 ** (normalizedLength - 1);
    const max = 10 ** normalizedLength - 1;

    return String(Math.floor(min + Math.random() * (max - min + 1)));
  }
}