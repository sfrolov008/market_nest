import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { LocationService } from './location.service';
import { City, Region } from './entities/locaton.model';
import { LocationController } from './location.controller';

@Module({
  imports: [SequelizeModule.forFeature([Region, City])],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
