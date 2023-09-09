import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ResponseFormater } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: ['error', 'debug', 'log', 'verbose', 'warn'],
  });

  // ValidationPipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
  }))

  // CORS
  const corsOptions: CorsOptions = {
    origin: process.env.NODE_ENV === 'production' ?
      ['*'] :
      '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  }
  app.enableCors(corsOptions);

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJs API')
    .setDescription('NestJs API description')
    .setVersion('1.0')
    .addTag('NestJs')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  // Interceptors
  const reflector = new Reflector();
  app.useGlobalInterceptors(new ResponseFormater(reflector));

  // Exeption Filter
  app.useGlobalFilters(new HttpExceptionFilter())

  // Helmet
  app.use(helmet())

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
bootstrap();
