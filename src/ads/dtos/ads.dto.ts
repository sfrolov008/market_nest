import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, Length } from 'class-validator';

import { CurrencyEnum } from '../../common/enums/currency.enum';

export class AdsDto {
  @ApiProperty({
    example: 'Car for sale',
    description: 'Car...',
  })
  @IsString({ message: 'Title should be a string' })
  @Length(1, 60, {
    message: 'Title length should be between 1 and 60 characters',
  })
  title: string;

  @ApiProperty({
    example: '1000',
    description: 'Car price',
  })
  @IsNumber({}, { message: 'Price should be a number' })
  price: number;

  @IsEnum(CurrencyEnum, { message: 'Invalid currency type' })
  currencyType: CurrencyEnum;

  @ApiProperty({
    example: 'Sale car ...',
    description: 'Car description',
  })
  @IsString({ message: 'Description should be a string' })
  @Length(1, 255, {
    message: 'Description length should be between 1 and 255 characters',
  })
  description: string;

  photo?: string[];

  @IsString({ message: 'Make ID should be a string' })
  makeId: string;

  @IsString({ message: 'Model ID should be a string' })
  modelId: string;

  @IsString({ message: 'Gen ID should be a string' })
  genId: string;

  @IsString({ message: 'Region ID should be a string' })
  regionId: string;

  @IsString({ message: 'City ID should be a string' })
  cityId: string;
}
