import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { City, Region } from './entities/locaton.model';
import { CityDto, RegionDto } from './dtos/location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Region) private regionModel: typeof Region,
    @InjectModel(City) private cityModel: typeof City,
  ) {}

  async createRegion(regionData: RegionDto): Promise<Region> {
    try {
      return this.regionModel.create(regionData);
    } catch (error) {
      throw new HttpException(
        'Failed to create region',
        HttpStatus.BAD_REQUEST,
        error,
      );
    }
  }

  async getAllRegions(): Promise<Region[]> {
    try {
      return this.regionModel.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch Regions',
        HttpStatus.BAD_REQUEST,
        error,
      );
    }
  }

  async getOneRegion(regionId: string): Promise<Region> {
    try {
      return this.regionModel.findOne({ where: { id: regionId } });
    } catch (error) {
      if (NotFoundException) {
        throw new NotFoundException(`Region with ${regionId} not found`);
      }
      throw new HttpException('Failed to fetch region', HttpStatus.BAD_REQUEST);
    }
  }

  async updateRegion(
    regionId: string,
    updateRegData: RegionDto,
  ): Promise<Region> {
    const [updatedRowsCount, [updatedRegion]] = await this.regionModel.update(
      updateRegData,
      {
        where: { id: regionId },
        returning: true,
      },
    );
    if (updatedRowsCount === 0) {
      throw new NotFoundException(`Region with ${regionId} not found`);
    }
    return updatedRegion;
  }

  async removeRegion(regionId: string) {
    const deletedRowsCount = await this.regionModel.destroy({
      where: { id: regionId },
    });
    if (deletedRowsCount === 0) {
      throw new NotFoundException(`Region with ${regionId} not found`);
    }
  }

  async createCity(CityData: CityDto): Promise<City> {
    try {
      return this.cityModel.create(CityData);
    } catch (error) {
      throw new HttpException(
        'Failed to create city',
        HttpStatus.BAD_REQUEST,
        error,
      );
    }
  }

  async getAllCities(regionId: string): Promise<City[]> {
    try {
      return this.cityModel.findAll({ where: { regionId } });
    } catch (error) {
      throw new HttpException(
        'Failed to fetch Cities',
        HttpStatus.BAD_REQUEST,
        error,
      );
    }
  }

  async getOneCity(cityId: string): Promise<City> {
    try {
      return this.cityModel.findOne({ where: { id: cityId } });
    } catch (error) {
      if (NotFoundException) {
        throw new NotFoundException(`City with ${cityId} not found`);
      }
      throw new HttpException('Failed to fetch city', HttpStatus.BAD_REQUEST);
    }
  }

  async updateCity(cityId: string, updateCityData: CityDto): Promise<City> {
    const [updatedRowsCount, [updatedCity]] = await this.cityModel.update(
      updateCityData,
      {
        where: { id: cityId },
        returning: true,
      },
    );
    if (updatedRowsCount === 0) {
      throw new NotFoundException(`City with ${cityId} not found`);
    }
    return updatedCity;
  }

  async removeCity(cityId: string) {
    const deletedRowsCount = await this.cityModel.destroy({
      where: { id: cityId },
    });
    if (deletedRowsCount === 0) {
      throw new NotFoundException(`City with ${cityId} not found`);
    }
  }
}
