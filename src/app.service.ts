import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const TEST = process.env.TEST as string
    return `Hello ${TEST}`;
  }
}
