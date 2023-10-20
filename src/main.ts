import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exeption.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const errorsForResponse: any = [];
        errors.forEach((el: any) => {
          const constraintsKeys = Object.keys(el.constraints);
          console.log('16+++main', el, '--constrKeys--', constraintsKeys);

          constraintsKeys.forEach((ckey) => {
            const obj: any = {
              message: el.constraints[ckey],
              field: el.property,
            };
            errorsForResponse.push(obj);
          });
        });
        throw new BadRequestException(errorsForResponse);
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3003);
}
bootstrap();
