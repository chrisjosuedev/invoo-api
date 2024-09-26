import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setting prefix
  app.setGlobalPrefix('api/v1');

  // Run 
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
