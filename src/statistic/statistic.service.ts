import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { Ads } from '../ads/entities/ads.model';

@Injectable()
export class StatisticService {
  constructor(@InjectModel(Ads) private adsModel: typeof Ads) {}
  async getAdsViews(adsId: string) {
    try {
      const currentDate = new Date();
      const oneDay = 24 * 60 * 60 * 1000;
      const dayInterval = new Date(currentDate.getTime() - oneDay);
      const weekInterval = new Date(currentDate.getTime() - 7 * oneDay);
      const monthInterval = new Date(currentDate.getTime() - 30 * oneDay);

      const ads = await this.adsModel.findByPk(adsId);

      const viewsAll = await this.adsModel.aggregate('views', 'sum', {
        where: { id: ads.id },
      });
      const viewsMonth = await this.adsModel.aggregate('views', 'sum', {
        where: {
          id: ads.id,
          createdAt: {
            [Op.gte]: monthInterval,
          },
        },
      });
      const viewsWeek = await this.adsModel.aggregate('views', 'sum', {
        where: {
          id: ads.id,
          createdAt: {
            [Op.gte]: weekInterval,
          },
        },
      });
      const viewsDay = await this.adsModel.aggregate('views', 'sum', {
        where: {
          id: ads.id,
          createdAt: {
            [Op.gte]: dayInterval,
          },
        },
      });
      return {
        viewsAll,
        viewsMonth,
        viewsWeek,
        viewsDay,
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAdsAvPrice(adsId: string) {
    try {
      const ads = await this.adsModel.findByPk(adsId);

      const avPriceCountry = await this.adsModel.aggregate('priceUAH', 'avg', {
        where: {
          makeId: ads.makeId,
          modelId: ads.modelId,
          genId: ads.genId,
        },
      });
      const avPriceRegion = await this.adsModel.aggregate('priceUAH', 'avg', {
        where: {
          makeId: ads.makeId,
          modelId: ads.modelId,
          genId: ads.genId,
          regionId: ads.regionId,
        },
      });
      const avPriceCity = await this.adsModel.aggregate('priceUAH', 'avg', {
        where: {
          makeId: ads.makeId,
          modelId: ads.modelId,
          genId: ads.genId,
          regionId: ads.regionId,
          cityId: ads.cityId,
        },
      });
      return {
        avPriceCountry,
        avPriceRegion,
        avPriceCity,
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
