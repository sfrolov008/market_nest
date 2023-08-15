import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';
import { Ads } from './entities/ads.model';
import { CarGen, CarMake, CarModel } from '../cars/entities/car.model';
import { User } from '../user/entities/users.model';
import { City, Region } from '../location/entities/locaton.model';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { S3Module } from '../s3/s3.module';
import { CurrencyModule } from '../currency/currency.module';
import { Currency } from '../currency/entities/currency.model';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Ads,
      CarMake,
      CarModel,
      CarGen,
      User,
      CarMake,
      CarModel,
      CarGen,
      Region,
      City,
      Currency,
    ]),
    AuthModule,
    MailModule,
    S3Module,
    CurrencyModule,
    UserModule,
  ],
  controllers: [AdsController],
  providers: [AdsService],
})
export class AdsModule {}
