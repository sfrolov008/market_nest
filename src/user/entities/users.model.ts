import {
  Column,
  DataType,
  Default,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Token } from '../../auth/token/entities/token.model';
import { ActionToken } from '../../auth/token/entities/action-token.model';
import { Ads } from '../../ads/entities/ads.model';
import { RoleEnum } from '../../common/enums/role.enum';
import { AccountEnum } from '../../common/enums/account.enum';
import { UserStatusEnum } from '../../common/enums/user-status.enum';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @ApiProperty({
    example: 'f7476aee-a139-45c3-b731-6d8fd185e1b5',
    description: 'unique id',
  })
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column({ type: DataType.UUID, allowNull: false })
  id: string;

  @ApiProperty({
    example: 'John',
    description: 'user name',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({
    example: 'john@mail.com',
    description: 'user email',
  })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @ApiProperty({
    example: '0501234567',
    description: 'user phone',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  phone: string;

  @ApiProperty({
    example: 'Qwerty123',
    description: 'user password',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ApiProperty({
    description: 'user avatar',
  })
  @Column({ type: DataType.STRING, allowNull: true })
  avatar: string;

  @ApiPropertyOptional({ type: typeof RoleEnum, example: 'admin' })
  @Column({ type: DataType.STRING, allowNull: true })
  role: RoleEnum;

  @ApiPropertyOptional({ type: typeof AccountEnum, example: 'premium' })
  @Column({ type: DataType.STRING, allowNull: true })
  account: AccountEnum;

  @ApiPropertyOptional({ type: typeof UserStatusEnum, example: 'active' })
  @Default('inactive')
  @Column({ type: DataType.STRING, allowNull: true })
  status: UserStatusEnum;

  @HasOne(() => Token)
  tokens: Token;

  @HasOne(() => ActionToken)
  actionTokens: ActionToken;

  @ApiPropertyOptional({ type: () => [Ads] })
  @HasMany(() => Ads)
  ads: Ads[];
}
