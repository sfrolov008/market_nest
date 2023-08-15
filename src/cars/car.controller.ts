import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CarService } from './car.service';
import { CarGen, CarMake, CarModel } from './entities/car.model';
import { GenDto, MakeDto, ModelDto } from './dtos/car.dto';
import { RolesGuard } from '../auth/guards/role-auth.guard';
import { Roles } from '../common/decorators/role.decorator';

@ApiTags('Car')
@Controller('car')
@UseGuards(RolesGuard)
export class CarController {
  constructor(private carService: CarService) {}

  @ApiOperation({ summary: 'Create make' })
  @ApiResponse({ status: 201, type: CarMake })
  @Roles('manager', 'admin')
  @Post('/make')
  async createMake(
    @Req() req: Request,
    @Res() res: Response,
    @Body() makeData: MakeDto,
  ): Promise<Response<CarMake>> {
    return res
      .status(HttpStatus.CREATED)
      .json(await this.carService.createMake(makeData));
  }

  @ApiOperation({ summary: 'Get all makes []' })
  @ApiResponse({ status: 200, type: CarMake })
  @Roles('manager', 'admin')
  @Get('/make')
  async getAllMakes(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<CarMake[]>> {
    return res.status(HttpStatus.OK).json(await this.carService.getAllMakes());
  }

  @ApiOperation({ summary: 'Get one make by ID' })
  @ApiResponse({ status: 200, type: CarMake })
  @Roles('manager', 'admin')
  @Get('make/:makeId')
  async getOneMake(
    @Req() req: Request,
    @Res() res: Response,
    @Param('makeId') makeId: string,
  ): Promise<Response<CarMake>> {
    return res
      .status(HttpStatus.OK)
      .json(await this.carService.getOneMake(makeId));
  }

  @ApiOperation({ summary: 'Update  make by' })
  @ApiResponse({ status: 200, type: CarMake })
  @Roles('manager', 'admin')
  @Patch('make/:makeId')
  async updateMake(
    @Req() req: Request,
    @Res() res: Response,
    @Param('makeId') makeId: string,
    @Body() updateMakeData: MakeDto,
  ): Promise<Response<CarMake>> {
    return res
      .status(HttpStatus.OK)
      .json(await this.carService.updateMake(makeId, updateMakeData));
  }

  @ApiOperation({ summary: 'Delete one make by id' })
  @ApiResponse({ status: 204 })
  @Roles('manager', 'admin')
  @Delete('/make/:makeId')
  async removeMake(
    @Res() res: Response,
    @Param('makeId') makeId: string,
  ): Promise<void> {
    await this.carService.removeMake(makeId);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @ApiOperation({ summary: 'Create model' })
  @ApiResponse({ status: 201, type: CarModel })
  @Roles('manager', 'admin')
  @Post('/make/:makeId/model')
  async createModel(
    @Req() req: Request,
    @Res() res: Response,
    @Body() modelData: ModelDto,
  ): Promise<Response<CarModel>> {
    return res
      .status(HttpStatus.CREATED)
      .json(await this.carService.createModel(modelData));
  }

  @ApiOperation({ summary: 'Get all models []' })
  @ApiResponse({ status: 200, type: CarModel })
  @Roles('manager', 'admin')
  @Get('/make/:makeId/model')
  async getAllModels(
    @Req() req: Request,
    @Res() res: Response,
    @Param('makeId') makeId: string,
  ): Promise<Response<CarModel[]>> {
    return res
      .status(HttpStatus.OK)
      .json(await this.carService.getAllModels(makeId));
  }

  @ApiOperation({ summary: 'Get model by ID' })
  @ApiResponse({ status: 200, type: CarModel })
  @Roles('manager', 'admin')
  @Get('/make/model/:modelId')
  async getOneModel(
    @Req() req: Request,
    @Res() res: Response,
    @Param('modelId') modelId: string,
  ): Promise<Response<CarModel>> {
    return res
      .status(HttpStatus.OK)
      .json(await this.carService.getOneModel(modelId));
  }

  @ApiOperation({ summary: 'Update model by ID' })
  @ApiResponse({ status: 200, type: CarModel })
  @Roles('manager', 'admin')
  @Patch('/make/model/:modelId')
  async updateModel(
    @Req() req: Request,
    @Res() res: Response,
    @Param('modelId') modelId: string,
    @Body() updateModelData: ModelDto,
  ): Promise<Response<CarModel>> {
    return res
      .status(HttpStatus.OK)
      .json(await this.carService.updateModel(modelId, updateModelData));
  }

  @ApiOperation({ summary: 'Delete model by id' })
  @ApiResponse({ status: 204 })
  @Roles('manager', 'admin')
  @Delete('/make/model/:modelId')
  async removeModel(
    @Res() res: Response,
    @Param('modelId') modelId: string,
  ): Promise<void> {
    await this.carService.removeModel(modelId);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @ApiOperation({ summary: 'Create generation' })
  @ApiResponse({ status: 201, type: CarGen })
  @Roles('manager', 'admin')
  @Post('/model/:modelId/gen')
  async createGen(
    @Req() req: Request,
    @Res() res: Response,
    @Body() genData: GenDto,
  ): Promise<Response<CarGen>> {
    return res
      .status(HttpStatus.CREATED)
      .json(await this.carService.createGen(genData));
  }

  @ApiOperation({ summary: 'Get all generations[]' })
  @ApiResponse({ status: 200, type: CarGen })
  @Roles('manager', 'admin')
  @Get('/model/:modelId/gen')
  async getAllGen(
    @Req() req: Request,
    @Res() res: Response,
    @Param('modelId') modelId: string,
  ): Promise<Response<CarGen[]>> {
    return res
      .status(HttpStatus.OK)
      .json(await this.carService.getAllGens(modelId));
  }

  @ApiOperation({ summary: 'Get generation by ID' })
  @ApiResponse({ status: 200, type: CarGen })
  @Roles('manager', 'admin')
  @Get('/model/gen/:genId')
  async getOneGen(
    @Req() req: Request,
    @Res() res: Response,
    @Param('genId') genId: string,
  ): Promise<Response<CarGen>> {
    return res
      .status(HttpStatus.OK)
      .json(await this.carService.getOneGen(genId));
  }

  @ApiOperation({ summary: 'Get generation by ID' })
  @ApiResponse({ status: 200, type: CarGen })
  @Roles('manager', 'admin')
  @Patch('/model/gen/:genId')
  async updateGen(
    @Req() req: Request,
    @Res() res: Response,
    @Param('genId') genId: string,
    @Body() updateGenData: GenDto,
  ): Promise<Response<CarGen>> {
    return res
      .status(HttpStatus.OK)
      .json(await this.carService.updateGen(genId, updateGenData));
  }

  @ApiOperation({ summary: 'Delete generation by id' })
  @ApiResponse({ status: 204 })
  @Roles('manager', 'admin')
  @Delete('/model/gen/:genId')
  async removeGen(
    @Res() res: Response,
    @Param('genId') genId: string,
  ): Promise<void> {
    await this.carService.removeGen(genId);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
