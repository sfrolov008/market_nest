import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CurrencyService } from './currency.service';
import { Currency } from './entities/currency.model';

@ApiTags('Currency')
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @ApiOperation({ summary: 'Get all currency []' })
  @ApiResponse({ status: 200, type: Currency })
  @Get()
  async getAllNew(@Res() res): Promise<Currency[]> {
    return res
      .status(HttpStatus.OK)
      .json(await this.currencyService.getAllNew());
  }
}
