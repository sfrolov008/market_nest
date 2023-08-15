import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';
import { Currency } from './entities/currency.model';
import { Ads } from '../ads/entities/ads.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([Currency, Ads]), AuthModule],
  controllers: [CurrencyController],
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
