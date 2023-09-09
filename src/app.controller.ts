import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { ResponseMessage } from '@/common/decorators/response.decorator';

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
  @ResponseMessage("Hello")
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('test')
  @ResponseMessage("Test")
  getTest(@Body() body: Test): Test {
    return body;
  }
}
