import {
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Ads } from '../../ads/entities/ads.model';

@Table({ tableName: 'currency', updatedAt: false })
export class Currency extends Model<Currency> {
  @ApiProperty({
    example: 'f7476aee-a139-45c3-b731-6d8fd185e1b5',
    description: 'unique id',
  })
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column({ type: DataType.UUID, allowNull: false })
  id: string;

  @ApiProperty({ example: 'EUR' })
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
  EUR: number;

  @ApiProperty({ example: 'USD' })
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
  USD: number;

  @ApiPropertyOptional({ type: () => [Ads] })
  @HasMany(() => Ads)
  ads: Ads[];
}
