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
import { User } from '../../../user/entities/users.model';

@Table({ tableName: 'tokens' })
export class Token extends Model<Token> {
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column({ type: DataType.UUID, allowNull: false })
  id: string;

  @Column({ type: DataType.STRING(500), allowNull: false })
  refreshToken: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  userId: string;
  @BelongsTo(() => User)
  user: User;
}
