/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  private readonly saltRound = 10;

  async hashPassword(password: string): Promise<string> {
    const hashedPassword = (await bcrypt.hash(
      password,
      this.saltRound,
    )) as string;
    return hashedPassword;
  }

  async comparePassword(password: string, hashed: string): Promise<boolean> {
    const isMatch = (await bcrypt.compare(password, hashed)) as boolean;
    return isMatch;
  }
}
