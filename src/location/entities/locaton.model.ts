import {
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Ads } from '../../ads/entities/ads.model';

@Table({ tableName: 'region', createdAt: false, updatedAt: false })
export class Region extends Model<Region> {
  @ApiProperty({
    example: 'f7476aee-a139-45c3-b731-6d8fd185e1b5',
    description: 'unique id',
  })
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column({ type: DataType.UUID, allowNull: false })
  id: string;
  @ApiProperty({ example: 'Create region Kharkivska' })
  @Column({ type: DataType.STRING, allowNull: false })
  value: string;

  @ApiPropertyOptional({ type: () => [City] })
  @HasMany(() => City)
  models: City[];

  @ApiPropertyOptional({ type: () => [Ads] })
  @HasMany(() => Ads)
  ads: Ads[];
}

@Table({ tableName: 'city', createdAt: false, updatedAt: false })
export class City extends Model<City> {
  @ApiProperty({
    example: 'f7476aee-a139-45c3-b731-6d8fd185e1b5',
    description: 'unique id',
  })
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column({ type: DataType.UUID, allowNull: false })
  id: string;

  @ApiProperty({ example: 'Create city Kharkiv' })
  @Column({ type: DataType.STRING, allowNull: false })
  value: string;

  @ApiPropertyOptional({ type: () => [Region] })
  @ForeignKey(() => Region)
  @Column({ type: DataType.UUID, allowNull: false })
  regionId: string;

  @ApiPropertyOptional({ type: () => [Region] })
  @BelongsTo(() => Region)
  region: Region;

  @ApiPropertyOptional({ type: () => [Ads] })
  @HasMany(() => Ads)
  ads: Ads[];
}
