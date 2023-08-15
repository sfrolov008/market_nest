import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { CarGen, CarMake, CarModel } from '../../cars/entities/car.model';
import { City, Region } from '../../location/entities/locaton.model';
import { User } from '../../user/entities/users.model';
import { Currency } from '../../currency/entities/currency.model';
import { AdsStatusEnum } from '../../common/enums/ads-status.enum';

@Table({ tableName: 'ads' })
export class Ads extends Model<Ads> {
  @ApiProperty({
    example: 'f7476aee-a139-45c3-b731-6d8fd185e1b5',
    description: 'unique id',
  })
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column({ type: DataType.UUID, allowNull: false })
  id: string;

  @ApiProperty({
    description: 'Car for sale',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ApiProperty({
    example: '77777',
    description: 'priceUAH',
  })
  @Column({ type: DataType.INTEGER, allowNull: false })
  priceUAH: number;

  @ApiProperty({
    example: '77777',
    description: 'priceEUR',
  })
  @Column({ type: DataType.INTEGER, allowNull: true })
  priceEUR: number;

  @ApiProperty({
    example: '77777',
    description: 'priceUSD',
  })
  @Column({ type: DataType.INTEGER, allowNull: true })
  priceUSD: number;

  @ApiProperty({
    example: 'Sale car ...',
    description: 'Car description',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @ApiProperty({
    example: 'box for photo links',
  })
  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
  photo: string[];

  @Default('inactive')
  @ApiPropertyOptional({ type: typeof AdsStatusEnum, example: 'active' })
  @Column({ type: DataType.STRING, allowNull: true })
  status: AdsStatusEnum;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  views: number;

  @ApiPropertyOptional({ type: () => [User] })
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @ApiPropertyOptional({ type: () => [Region] })
  @ForeignKey(() => Region)
  @Column({ type: DataType.UUID, allowNull: false })
  regionId: string;

  @BelongsTo(() => Region)
  region: Region;

  @ApiPropertyOptional({ type: () => [City] })
  @ForeignKey(() => City)
  @Column({ type: DataType.UUID, allowNull: false })
  cityId: string;

  @BelongsTo(() => City)
  city: City;

  @ApiPropertyOptional({ type: () => [CarMake] })
  @ForeignKey(() => CarMake)
  @Column({ type: DataType.UUID, allowNull: false })
  makeId: string;

  @BelongsTo(() => CarMake)
  make: CarMake;

  @ApiPropertyOptional({ type: () => [CarModel] })
  @ForeignKey(() => CarModel)
  @Column({ type: DataType.UUID, allowNull: false })
  modelId: string;

  @BelongsTo(() => CarModel)
  model: CarModel;

  @ApiPropertyOptional({ type: () => [CarGen] })
  @ForeignKey(() => CarGen)
  @Column({ type: DataType.UUID, allowNull: false })
  genId: string;

  @BelongsTo(() => CarGen)
  gen: CarGen;

  @ApiPropertyOptional({ type: () => [Currency] })
  @ForeignKey(() => Currency)
  @Column({ type: DataType.UUID, allowNull: false })
  currencyId: string;

  @BelongsTo(() => Currency)
  currency: Currency;
}
