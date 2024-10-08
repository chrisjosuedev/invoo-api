import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ErrorDto } from './common/dto/error-dto.dto';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setting prefix
  app.setGlobalPrefix('api/v1');
  
  /**
   * TODO: Custom errors in string array, Exclude certains Fields from Fetching data
   */

  // Validations Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          new ErrorDto(
            HttpStatus.BAD_REQUEST,
            'Error in fields.',
            validationErrors.map((error) => ({
              field: error.property,
              error: Object.values(error.constraints).join(', '),
            })),
          ),
        );
      },
    }),
  );

  // Run
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
