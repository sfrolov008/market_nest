import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AdsService } from './ads.service';
import { Ads } from './entities/ads.model';
import { AdsDto } from './dtos/ads.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFilePipe } from '../common/pipes/upload-file.pipe';
import { StatusDto } from './dtos/status.dto';
import { IAdsPagResponse } from '../common/interfaces/ads.pag.response.interface';
import { SortOptionEnum } from '../common/enums/sort.option.enum';
import { RolesGuard } from '../auth/guards/role-auth.guard';
import { Roles } from '../common/decorators/role.decorator';

@ApiTags('Advertising')
@Controller('ads')
@UseGuards(RolesGuard)
export class AdsController {
  constructor(private adsService: AdsService) {}

  @ApiOperation({ summary: 'Create ads' })
  @ApiResponse({ status: 201, type: Ads })
  @Roles('customer', 'seller', 'manager', 'admin')
  @Post()
  async createAds(
    @Req() req: Request,
    @Res() res: Response,
    @Body() adsData: AdsDto,
  ): Promise<Response<Ads>> {
    const authData = req.headers.authorization;
    return res
      .status(HttpStatus.CREATED)
      .json(await this.adsService.createAds(adsData, authData));
  }

  @ApiOperation({ summary: 'Get all ads' })
  @ApiResponse({ status: 200, type: [Ads] })
  @Get()
  async getAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sort') sort: SortOptionEnum,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<IAdsPagResponse>> {
    return res
      .status(HttpStatus.OK)
      .json(await this.adsService.getAll(page, limit, sort));
  }

  @ApiOperation({ summary: 'Get one ad by ID' })
  @ApiResponse({ status: 200, type: Ads })
  @Get('/:id')
  async getOne(
    @Res() res: Response,
    @Param('id') adsId: string,
  ): Promise<Response<Ads>> {
    return res.status(HttpStatus.OK).json(await this.adsService.getOne(adsId));
  }

  @ApiOperation({ summary: 'Update one ad by ID' })
  @ApiResponse({ status: 200, type: Ads })
  @Roles('manager', 'admin')
  @Patch('/:id')
  async update(
    @Res() res: Response,
    @Param('id') adsId: string,
    @Body() adsData: Partial<AdsDto>,
  ): Promise<Response<Ads>> {
    return res
      .status(HttpStatus.OK)
      .json(await this.adsService.update(adsData, adsId));
  }
  @ApiOperation({ summary: 'Update one ad by tokenId' })
  @ApiResponse({ status: 200, type: Ads })
  @Roles('seller')
  @Patch('/:id/seller')
  async updateByOwner(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') adsId: string,
    @Body() adsData: Partial<AdsDto>,
  ): Promise<Response<Ads>> {
    const authData = req.headers.authorization;
    return res
      .status(HttpStatus.OK)
      .json(await this.adsService.updateByOwner(adsData, authData, adsId));
  }

  @ApiOperation({ summary: 'Delete one ad by Id' })
  @ApiResponse({ status: 204 })
  @Roles('manager', 'admin')
  @Delete('/:id')
  async remove(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') adsId: string,
  ): Promise<void> {
    await this.adsService.remove(adsId);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @ApiOperation({ summary: 'Delete one ad by Id' })
  @ApiResponse({ status: 204 })
  @Roles('seller')
  @Delete('/:id/auth')
  async findByIdAndRemove(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') adsId: string,
  ): Promise<void> {
    const authData = req.headers.authorization;
    await this.adsService.findByIdAndRemove(adsId, authData);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @ApiOperation({ summary: 'Upload photo' })
  @ApiResponse({ status: 200 })
  @Roles('seller', 'manager', 'admin')
  @Post('photo/:id')
  @UseInterceptors(FileInterceptor('photo'))
  async uploadPhoto(
    @Res() res: Response,
    @Param('id') adsId: string,
    @UploadedFile(UploadFilePipe) file: Express.Multer.File,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.adsService.uploadPhoto(adsId, file));
  }

  @ApiOperation({ summary: 'Set or change status' })
  @ApiResponse({ status: 200 })
  @Roles('manager', 'admin')
  @Patch('status/:id')
  async changeStatus(@Res() res: Response, @Body() statusData: StatusDto) {
    return res
      .status(HttpStatus.OK)
      .json(await this.adsService.changeStatus(statusData));
  }
}
