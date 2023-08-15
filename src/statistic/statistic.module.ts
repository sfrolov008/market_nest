import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AuthModule } from '../auth/auth.module';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';
import { Ads } from '../ads/entities/ads.model';

@Module({
  imports: [SequelizeModule.forFeature([Ads]), AuthModule],
  controllers: [StatisticController],
  providers: [StatisticService],
})
export class StatisticModule {}
