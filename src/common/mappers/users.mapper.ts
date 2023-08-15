import * as process from 'process';

import { User } from '../../user/entities/users.model';

class UserMapper {
  public toResponse(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar ? `${process.env.AWS_S3_URL}/${user.avatar}` : null,
      role: user.role,
      account: user.account,
    };
  }
}

export const userMapper = new UserMapper();
