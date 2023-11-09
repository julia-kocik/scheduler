import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { AppController } from './app.controller';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
        const isProduction = configService.get('STAGE') === 'prod';
        const isTest = configService.get('STAGE') === 'test';
        if(isTest) {
          return {
            type: 'sqlite',
            database: ':memory:',
            entities: [__dirname + '/../**/*.entity.ts'],
            synchronize: true,
            logging: false,
          }
        }
        return {
          ssl: isProduction ? true : false,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          type: 'postgres',
          url: !isProduction ? configService.get('DATABASE_URL') : '',
          port: configService.get('POSTGRES_PORT'),
          host: configService.get('POSTGRES_HOST'),
          autoLoadEntities: true,
          synchronize: true,
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DB'),
        };
      },
    }),
    EventModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
