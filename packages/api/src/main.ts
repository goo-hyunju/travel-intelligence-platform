import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS for frontend requests
  await app.listen(3001);
  console.log(`API is running on: http://localhost:3001/graphql`);
}
bootstrap();