import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { ScheduleModule } from '@nestjs/schedule';

import { AdsModule } from './ads/ads.module';
import { AuthModule } from './auth/auth.module';
import { CarModule } from './cars/car.module';
import { CurrencyModule } from './currency/currency.module';
import { LocationModule } from './location/location.module';
import { MailModule } from './mail/mail.module';
import { S3Module } from './s3/s3.module';
import { StatisticModule } from './statistic/statistic.module';
import { UserModule } from './user/user.module';
import { ActionToken } from './auth/token/entities/action-token.model';
import { Ads } from './ads/entities/ads.model';
import { CarGen, CarMake, CarModel } from './cars/entities/car.model';
import { Currency } from './currency/entities/currency.model';
import { City, Region } from './location/entities/locaton.model';
import { Token } from './auth/token/entities/token.model';
import { User } from './user/entities/users.model';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ envFilePath: '.env' }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadModels: true,
      synchronize: true,
      models: [
        User,
        Token,
        ActionToken,
        CarMake,
        CarModel,
        CarGen,
        Region,
        City,
        Ads,
        Currency,
      ],
    }),
    UserModule,
    S3Module,
    AuthModule,
    MailModule,
    CarModule,
    LocationModule,
    AdsModule,
    CurrencyModule,
    StatisticModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
