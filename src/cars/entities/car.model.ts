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

@Table({ tableName: 'carMakes', createdAt: false, updatedAt: false })
export class CarMake extends Model<CarMake> {
  @ApiProperty({
    example: 'f7476aee-a139-45c3-b731-6d8fd185e1b5',
    description: 'unique id',
  })
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column({ type: DataType.UUID, allowNull: false })
  id: string;

  @ApiProperty({ example: 'Create make "Acura"' })
  @Column({ type: DataType.STRING, allowNull: false })
  value: string;

  @ApiPropertyOptional({ type: () => [CarModel] })
  @HasMany(() => CarModel)
  models: CarModel[];

  @ApiPropertyOptional({ type: () => [Ads] })
  @HasMany(() => Ads)
  ads: Ads[];
}

@Table({ tableName: 'carModels', createdAt: false, updatedAt: false })
export class CarModel extends Model<CarModel> {
  @ApiProperty({
    example: 'f7476aee-a139-45c3-b731-6d8fd185e1b5',
    description: 'unique id',
  })
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column({ type: DataType.UUID, allowNull: false })
  id: string;

  @ApiProperty({ example: 'Create model "RDX"' })
  @Column({ type: DataType.STRING, allowNull: false })
  value: string;

  @ApiPropertyOptional({ type: () => [CarMake] })
  @ForeignKey(() => CarMake)
  @Column({ type: DataType.UUID, allowNull: false })
  makeId: string;

  @ApiPropertyOptional({ type: () => [CarMake] })
  @BelongsTo(() => CarMake)
  make: CarMake;

  @ApiPropertyOptional({ type: () => [CarGen] })
  @HasMany(() => CarGen)
  gens: CarGen[];

  @ApiPropertyOptional({ type: () => [Ads] })
  @HasMany(() => Ads)
  ads: Ads[];
}

@Table({ tableName: 'carGen', createdAt: false, updatedAt: false })
export class CarGen extends Model<CarGen> {
  @ApiProperty({
    example: 'f7476aee-a139-45c3-b731-6d8fd185e1b5',
    description: 'unique id',
  })
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column({ type: DataType.UUID, allowNull: false })
  id: string;

  @ApiProperty({ example: 'Create generation "4"' })
  @Column({ type: DataType.STRING, allowNull: false })
  value: string;

  @ApiPropertyOptional({ type: () => [CarModel] })
  @ForeignKey(() => CarModel)
  @Column({ type: DataType.UUID, allowNull: false })
  modelId: string;

  @ApiPropertyOptional({ type: () => [CarModel] })
  @BelongsTo(() => CarModel)
  model: CarModel;

  @ApiPropertyOptional({ type: () => [Ads] })
  @HasMany(() => Ads)
  ads: Ads[];
}
