import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CarController } from './car.controller';
import { CarService } from './car.service';
import { CarGen, CarMake, CarModel } from './entities/car.model';

@Module({
  imports: [SequelizeModule.forFeature([CarMake, CarModel, CarGen])],
  controllers: [CarController],
  providers: [CarService],
  exports: [CarService],
})
export class CarModule {}
