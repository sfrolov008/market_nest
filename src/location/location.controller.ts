import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { City, Region } from './entities/locaton.model';
import { CityDto, RegionDto } from './dtos/location.dto';
import { LocationService } from './location.service';
import { RolesGuard } from '../auth/guards/role-auth.guard';
import { Roles } from '../common/decorators/role.decorator';

@ApiTags('Location')
@Controller('location')
@UseGuards(RolesGuard)
export class LocationController {
  constructor(private locationService: LocationService) {}

  @ApiOperation({ summary: 'Create region' })
  @ApiResponse({ status: 201, type: Region })
  @Roles('manager', 'admin')
  @Post('/region')
  async createRegion(
    @Res() res: Response,
    @Body() regionData: RegionDto,
  ): Promise<Response<Region>> {
    return res
      .status(HttpStatus.CREATED)
      .json(await this.locationService.createRegion(regionData));
  }

  @ApiOperation({ summary: 'Get all regions []' })
  @ApiResponse({ status: 200, type: Region })
  @Roles('manager', 'admin')
  @Get('/region')
  async getAllRegions(@Res() res: Response): Promise<Response<Region[]>> {
    return res
      .status(HttpStatus.OK)
      .json(await this.locationService.getAllRegions());
  }

  @ApiOperation({ summary: 'Get region by ID' })
  @ApiResponse({ status: 200, type: Region })
  @Roles('manager', 'admin')
  @Get('/region/:regionId')
  async getOneRegion(
    @Res() res: Response,
    @Param('regionId') regionId: string,
  ): Promise<Response<Region>> {
    return res
      .status(HttpStatus.OK)
      .json(await this.locationService.getOneRegion(regionId));
  }

  @ApiOperation({ summary: 'Update region by ID' })
  @ApiResponse({ status: 200, type: Region })
  @Roles('manager', 'admin')
  @Patch('/region/:regionId')
  async updateRegion(
    @Res() res: Response,
    @Param('regionId') regionId: string,
    @Body() updateRegData: RegionDto,
  ): Promise<Response<Region>> {
    return res
      .status(HttpStatus.OK)
      .json(await this.locationService.updateRegion(regionId, updateRegData));
  }

  @ApiOperation({ summary: 'Delete region' })
  @ApiResponse({ status: 204 })
  @Roles('manager', 'admin')
  @Delete('/region/:regionId')
  async removeRegion(
    @Res() res: Response,
    @Param('regionId') regionId: string,
  ): Promise<void> {
    await this.locationService.removeRegion(regionId);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @ApiOperation({ summary: 'Create city' })
  @ApiResponse({ status: 201, type: City })
  @Roles('manager', 'admin')
  @Post('region/:regionId/city')
  async createCity(
    @Res() res: Response,
    @Body() cityData: CityDto,
  ): Promise<Response<City>> {
    return res
      .status(HttpStatus.CREATED)
      .json(await this.locationService.createCity(cityData));
  }

  @ApiOperation({ summary: 'Get all cities []' })
  @ApiResponse({ status: 200, type: City })
  @Roles('manager', 'admin')
  @Get('region/:regionId/city')
  async getAllCities(
    @Res() res: Response,
    @Param('regionId') regionId: string,
  ): Promise<Response<City[]>> {
    return res
      .status(HttpStatus.OK)
      .json(await this.locationService.getAllCities(regionId));
  }

  @ApiOperation({ summary: 'Get city by ID' })
  @ApiResponse({ status: 200, type: City })
  @Roles('manager', 'admin')
  @Get('/region/city/:cityId')
  async getOneCity(
    @Res() res: Response,
    @Param('cityId') cityId: string,
  ): Promise<Response<City>> {
    return res
      .status(HttpStatus.OK)
      .json(await this.locationService.getOneCity(cityId));
  }

  @ApiOperation({ summary: 'Update city by ID' })
  @ApiResponse({ status: 200, type: City })
  @Roles('manager', 'admin')
  @Patch('/region/city/:cityId')
  async updateCity(
    @Res() res: Response,
    @Param('cityId') cityId: string,
    @Body() updateCityData: CityDto,
  ): Promise<Response<City>> {
    return res
      .status(HttpStatus.OK)
      .json(await this.locationService.updateCity(cityId, updateCityData));
  }

  @ApiOperation({ summary: 'Delete city' })
  @ApiResponse({ status: 204 })
  @Roles('manager', 'admin')
  @Delete('region/city/:cityId')
  async removeCity(
    @Res() res: Response,
    @Param('cityId') cityId: string,
  ): Promise<void> {
    await this.locationService.removeCity(cityId);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
