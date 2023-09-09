import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

class Test {
  @ApiProperty({ required: true, type: String, description: 'Name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ required: true, type: Number, description: 'Age' })
  @IsNotEmpty()
  @IsNumber()
  age: number;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('test')
  getTest(@Body() body: Test): Test {
    return body;
  }
}
