import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import express, { Request } from 'express';
import { AppModule } from './app.module';

export interface RequestWithRawBody extends Request {
  rawBody: Buffer;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  app.enableShutdownHooks();
  console.log('express', express);
  const rawBodyBuffer = (
    req: RequestWithRawBody,
    res: Response,
    buffer: Buffer,
  ) => {
    req.rawBody = Buffer.from(buffer);
  };

  app.use(
    express.urlencoded({
      verify: rawBodyBuffer as any,
      extended: true,
      limit: '100mb',
    }),
  );
  app.use(
    express.json({
      verify: rawBodyBuffer as any,
      limit: '100mb',
    }),
  );
  app.use(compression());

  await app.listen(3000);
}
bootstrap();
