import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { Order } from 'sequelize';
import * as Filter from 'bad-words';

import { S3Service } from '../s3/s3.service';
import { MailService } from '../mail/mail.service';
import { CurrencyService } from '../currency/currency.service';
import { Ads } from './entities/ads.model';
import { AdsDto } from './dtos/ads.dto';
import { StatusDto } from './dtos/status.dto';
import { IAdsPagResponse } from '../common/interfaces/ads.pag.response.interface';
import { SortOptionEnum } from '../common/enums/sort.option.enum';
import { AccountEnum } from '../common/enums/account.enum';
import { AdsStatusEnum } from '../common/enums/ads-status.enum';
import { CurrencyEnum } from '../common/enums/currency.enum';
import { MailEnum } from '../common/enums/mail.enum';
import { UploadFileTypesEnum } from '../common/enums/upload-file-type.enum';
import { maxPhotoCount } from '../common/constants/photo.constants';
import { adsMapper } from '../common/mappers/ads.mapper';
import { UserService } from '../user/user.service';
import { RoleEnum } from '../common/enums/role.enum';

@Injectable()
export class AdsService {
  constructor(
    private jwtService: JwtService,
    private mailService: MailService,
    private s3Service: S3Service,
    private currencyService: CurrencyService,
    private userService: UserService,
    @InjectModel(Ads) private adsModel: typeof Ads,
  ) {}

  async createAds(adsData: AdsDto, authData: string) {
    const {
      makeId,
      modelId,
      genId,
      regionId,
      cityId,
      price,
      currencyType,
      ...otherData
    } = adsData;
    const token = this.jwtService.verify(authData.split(' ')[1]);
    const userAccount = token.account;
    const adsCount = await this.adsModel.count({
      where: { userId: token.id },
    });
    if (userAccount !== AccountEnum.premium && adsCount >= 1) {
      await this.mailService.send(token.email, 'NOTICE', MailEnum.NOTICE, {});
      throw new ForbiddenException(
        'To post more than one ad, buy a premium account',
      );
    }
    const [currency] = await this.currencyService.getAllNew();
    if (!currency) {
      throw new HttpException(
        'Failed to fetch currency',
        HttpStatus.BAD_REQUEST,
      );
    }
    const prices = await this.currencyCalc(price, currencyType);
    const ads = await this.adsModel.create({
      ...otherData,
      userId: token.id,
      makeId: makeId,
      modelId: modelId,
      genId: genId,
      regionId: regionId,
      cityId: cityId,
      priceUAH: prices.priceUAH,
      priceEUR: prices.priceEUR,
      priceUSD: prices.priceUSD,
      currencyId: currency.id,
    });

    const isProfane = await this.checkForProfanity(ads.id);
    if (isProfane) {
      throw new ForbiddenException('Failed profanity test');
    }
    await this.userService.assignRole({
      userId: token.id,
      value: RoleEnum.seller,
    });
    ads.status = AdsStatusEnum.active;
    await ads.save();
    return ads;
  }

  async getAll(
    page = 1,
    limit = 24,
    sort: SortOptionEnum,
  ): Promise<IAdsPagResponse> {
    try {
      const offset = (page - 1) * limit;

      const orderOptions: Order = [['createdAt', 'DESC']];
      if (sort === SortOptionEnum.PriceAsc) {
        orderOptions.unshift(['priceUAH', 'ASC']);
      } else if (sort === SortOptionEnum.PriceDesc) {
        orderOptions.unshift(['priceUAH', 'DESC']);
      }

      const { count, rows } = await this.adsModel.findAndCountAll({
        where: { status: AdsStatusEnum.active },
        order: orderOptions,
        limit: limit,
        offset: offset,
      });

      const totalPages = Math.ceil(count / limit);

      return {
        totalCount: count,
        totalPages: totalPages,
        currentPage: page,
        limit: limit,
        ads: rows,
      };
    } catch (e) {
      console.log(e);
      throw new HttpException('Failed to fetch ads', HttpStatus.BAD_REQUEST);
    }
  }

  async getOne(adsId: string): Promise<Ads> {
    try {
      const ads = await this.adsModel.findByPk(adsId);
      if (ads) {
        ads.views += 1;
        await ads.save();
      }
      return ads;
    } catch (e) {
      if (NotFoundException) {
        throw new NotFoundException(`Ad with ${adsId} not found`);
      }
      throw new HttpException('Failed to fetch', HttpStatus.BAD_REQUEST);
    }
  }

  async update(adsData: Partial<AdsDto>, adsId: string): Promise<Ads> {
    const { price, currencyType, ...otherData } = adsData;
    const [currency] = await this.currencyService.getAllNew();
    const prices = await this.currencyCalc(price, currencyType);
    const [updatedRowsCount, [updatedAds]] = await this.adsModel.update(
      {
        ...otherData,
        priceUAH: prices.priceUAH,
        priceEUR: prices.priceEUR,
        priceUSD: prices.priceUSD,
        currencyId: currency.id,
      },
      {
        where: { id: adsId },
        returning: true,
      },
    );
    if (updatedRowsCount === 0) {
      throw new NotFoundException(`!Ads with ${adsId} not found`);
    }
    return updatedAds;
  }

  async updateByOwner(
    adsData: Partial<AdsDto>,
    authData: string,
    adsId: string,
  ): Promise<Ads> {
    const ads = await this.adsModel.findByPk(adsId);
    if (!ads) {
      throw new NotFoundException(`Ads with ID ${adsId} not found`);
    }
    const token = this.jwtService.verify(authData.split(' ')[1]);
    if (token.id !== ads.userId) {
      throw new ForbiddenException('Only available to the owner of the advert');
    }
    const { price, currencyType, ...otherData } = adsData;
    const [currency] = await this.currencyService.getAllNew();
    const prices = await this.currencyCalc(price, currencyType);
    const [updatedRowsCount, [updatedAds]] = await this.adsModel.update(
      {
        ...otherData,
        priceUAH: prices.priceUAH,
        priceEUR: prices.priceEUR,
        priceUSD: prices.priceUSD,
        currencyId: currency.id,
      },
      {
        where: { id: adsId },
        returning: true,
      },
    );
    if (updatedRowsCount === 0) {
      throw new NotFoundException(`Failed to update ads with ID ${adsId}`);
    }
    return updatedAds;
  }

  async remove(adsId: string): Promise<void> {
    try {
      await this.adsModel.destroy({ where: { id: adsId } });
    } catch (e) {
      throw new NotFoundException(`Ad with ${adsId} not found`);
    }
  }

  async findByIdAndRemove(adsId: string, authData: string): Promise<void> {
    const ads = await this.adsModel.findByPk(adsId);
    if (!ads) {
      throw new NotFoundException(`Ads with ID ${adsId} not found`);
    }
    const token = this.jwtService.verify(authData.split(' ')[1]);
    if (token.id !== ads.userId) {
      throw new ForbiddenException('Only available to the owner of the advert');
    }
    await this.adsModel.destroy({ where: { id: adsId } });
  }

  async uploadPhoto(
    adsId: string,
    file: Express.Multer.File,
  ): Promise<Partial<Ads>> {
    const ads = await this.adsModel.findByPk(adsId);
    if (!ads) {
      throw new HttpException('Ads not found', HttpStatus.NOT_FOUND);
    }
    if (ads.photo.length >= maxPhotoCount) {
      throw new HttpException(
        'Maximum number of photos reached',
        HttpStatus.BAD_REQUEST,
      );
    }
    const photoUrl = await this.s3Service.uploadFile(
      file,
      UploadFileTypesEnum.photo,
      adsId,
    );
    await ads.update({ photo: [...ads.photo, photoUrl] });
    return adsMapper.toResponse(ads);
  }

  async changeStatus(statusData: StatusDto) {
    const ads = await this.adsModel.findByPk(statusData.adsId);
    const assignedStatus = AdsStatusEnum[statusData.value];
    if (!ads) {
      throw new NotFoundException('Failed! Ads does not exist');
    }
    await ads.update({ status: assignedStatus });
    return statusData;
  }

  private async checkForProfanity(adsId: string): Promise<boolean> {
    const ads = await this.adsModel.findByPk(adsId);
    const filter = new Filter();
    return filter.isProfane(ads.description);
  }
  private async currencyCalc(price: number, currencyType: CurrencyEnum) {
    let priceUAH;
    let priceUSD;
    let priceEUR;
    const [currency] = await this.currencyService.getAllNew();
    switch (currencyType) {
      case CurrencyEnum.UAH:
        priceUAH = price;
        priceUSD = Math.round(price / currency.USD);
        priceEUR = Math.round(price / currency.EUR);
        break;
      case CurrencyEnum.USD:
        priceUAH = Math.round(price * currency.USD);
        priceUSD = price;
        priceEUR = Math.round((price * currency.USD) / currency.EUR);
        break;
      case CurrencyEnum.EUR:
        priceUAH = Math.round(price * currency.EUR);
        priceUSD = Math.round((price * currency.EUR) / currency.USD);
        priceEUR = price;
        break;
    }
    return { priceUAH, priceUSD, priceEUR };
  }
}
