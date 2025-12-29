import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';
import * as express from 'express';
import { graphqlUploadExpress } from 'graphql-upload';
import { WsAdapter } from '@nestjs/platform-ws';

// global integration
async function bootstrap() {
	const app = await NestFactory.create(AppModule); // app = nest + express
	app.useGlobalPipes(new ValidationPipe()); //validation
	app.useGlobalInterceptors(new LoggingInterceptor()); //interceptors
	app.enableCors({ origin: true, credentials: true });
	app.use(graphqlUploadExpress({ maxFileSize: 15000000, maxFiles: 10 }));
	app.use('/uploads', express.static('./uploads'));
	app.useWebSocketAdapter(new WsAdapter(app));
	const port = process.env.PORT_API ?? 3000;
	await app.listen(port);
	console.log(`🚀 Server is running on: http://localhost:${port}`);
	console.log(`📊 GraphQL Playground: http://localhost:${port}/graphql`);
}
bootstrap();
