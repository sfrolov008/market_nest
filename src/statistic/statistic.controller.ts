import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';

import { StatisticService } from './statistic.service';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  IStatPrice,
  IStatViews,
} from '../common/interfaces/statistic.inteface';
import { Roles } from '../common/decorators/role.decorator';
import { RolesGuard } from '../auth/guards/role-auth.guard';
import { AccountsGuard } from '../auth/guards/account-auth.guard';
import { Accounts } from '../common/decorators/account.decorator';

@ApiTags('Statistic')
@Controller('statistic')
@UseGuards(RolesGuard, AccountsGuard)
export class StatisticController {
  constructor(private statisticService: StatisticService) {}

  @ApiOperation({
    summary: 'Get statistic of ads views',
  })
  @ApiResponse({ status: 201 })
  @Roles('seller', 'manager', 'admin')
  @Accounts('premium')
  @Get('views/:id')
  async getAdsViews(
    @Res() res,
    @Param('id') adsId: string,
  ): Promise<IStatViews> {
    return res
      .status(HttpStatus.OK)
      .json(await this.statisticService.getAdsViews(adsId));
  }

  @ApiOperation({
    summary: 'Get statistic of ads average prices',
  })
  @ApiResponse({ status: 201 })
  @Roles('seller', 'manager', 'admin')
  @Accounts('premium')
  @Get('average/:id')
  async getAdsAvPrice(
    @Res() res,
    @Param('id') adsId: string,
  ): Promise<IStatPrice> {
    return res
      .status(HttpStatus.OK)
      .json(await this.statisticService.getAdsAvPrice(adsId));
  }
}
