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
import {ActionTokenEnum} from "../../../common/enums/action-token.enum";


@Table({ tableName: 'action_tokens' })
export class ActionToken extends Model<ActionToken> {
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column({ type: DataType.UUID, allowNull: false })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  actionToken: string;

  @Column({ type: DataType.STRING, allowNull: false })
  actionTokenType: ActionTokenEnum;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  userId: string;
  @BelongsTo(() => User)
  user: User;
}
