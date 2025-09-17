import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { ComponentsModule } from './components/components.module';
import { DatabaseModule } from './database/database.module';


@Module({
  imports: [
    ConfigModule.forRoot(), // for enviromental variable
    GraphQLModule.forRoot({  // for integration graphql api
    driver: ApolloDriver,
    playground: true,
    uploads: false,
    autoSchemaFile: true,
  }),
   ComponentsModule,  // basic backend logic and clean code
   DatabaseModule // mongdb connection
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
