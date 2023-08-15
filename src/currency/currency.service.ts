import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cron } from '@nestjs/schedule';
import * as process from 'process';

import { Currency } from './entities/currency.model';

@Injectable()
export class CurrencyService {
  constructor(@InjectModel(Currency) private currencyModel: typeof Currency) {}

  @Cron('0 0 12 * * *')
  async updateCurrency(): Promise<Currency> {
    try {
      const response = await fetch(process.env.API_BANK);
      const data = await response.json();

      const saleEUR = +data[0].sale;
      const saleUSD = +data[1].sale;

      return this.currencyModel.create({ EUR: saleEUR, USD: saleUSD });
    } catch (e) {
      console.log(e);
    }
  }

  async getAllNew(): Promise<Currency[]> {
    try {
      return this.currencyModel.findAll({
        order: [['createdAt', 'DESC']],
        limit: 1,
      });
    } catch (e) {
      console.log(e);
    }
  }
}
