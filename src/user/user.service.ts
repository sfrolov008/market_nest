import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';

import { User } from './entities/users.model';
import { S3Service } from '../s3/s3.service';
import { AccountDto } from './dtos/account.dto';
import { RoleDto } from './dtos/role.dto';
import { UserDto } from './dtos/user.dto';
import { UploadFileTypesEnum } from '../common/enums/upload-file-type.enum';
import { RoleEnum } from '../common/enums/role.enum';
import { AccountEnum } from '../common/enums/account.enum';
import { userMapper } from '../common/mappers/users.mapper';

@Injectable()
export class UserService {
  constructor(
    private readonly s3Service: S3Service,
    private jwtService: JwtService,
    @InjectModel(User) private userModel: typeof User,
  ) {}
  async create(userData: UserDto): Promise<User> {
    try {
      const user = await this.userModel.create(userData);
      user.role = RoleEnum.customer;
      user.account = AccountEnum.base;
      await user.save();
      return user;
    } catch (error) {
      throw new HttpException('Failed to create user', HttpStatus.BAD_REQUEST);
    }
  }

  async getAll(): Promise<User[]> {
    try {
      return this.userModel.findAll();
    } catch (error) {
      throw new HttpException('Failed to fetch users', HttpStatus.BAD_REQUEST);
    }
  }

  async getOne(id: string): Promise<User> {
    try {
      return await this.userModel.findByPk(id);
    } catch (error) {
      if (NotFoundException) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw new HttpException('Failed to fetch user', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateUserDto: Partial<UserDto>): Promise<User> {
    const [updatedRowsCount, [updatedUser]] = await this.userModel.update(
      updateUserDto,
      {
        where: { id },
        returning: true,
      },
    );
    if (updatedRowsCount === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async updateAuthUser(
    id: string,
    authData: string,
    updateUserDto: Partial<UserDto>,
  ): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const token = this.jwtService.verify(authData.split(' ')[1]);
    if (token.id !== user.id) {
      throw new ForbiddenException('Only available to the owner of account');
    }
    const [updatedRowsCount, [updatedUser]] = await this.userModel.update(
      updateUserDto,
      {
        where: { id },
        returning: true,
      },
    );
    if (updatedRowsCount === 0) {
      throw new NotFoundException(`Failed to update user with ID ${id}`);
    }
    return updatedUser;
  }

  async remove(id: string) {
    const deletedRowsCount = await this.userModel.destroy({ where: { id } });
    if (deletedRowsCount === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ where: { email } });
  }

  async uploadAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<Partial<User>> {
    try {
      const user = await this.userModel.findByPk(userId);
      if (user.avatar) {
        await this.s3Service.deleteFile(user.avatar);
      }
      const avatarUrl = await this.s3Service.uploadFile(
        file,
        UploadFileTypesEnum.users,
        userId,
      );
      if (user) {
        await user.update({ avatar: avatarUrl });
        return userMapper.toResponse(user);
      }
    } catch (error) {
      throw new HttpException(
        'Failed upload avatar',
        HttpStatus.BAD_REQUEST,
        error,
      );
    }
  }

  async assignRole(roleData: RoleDto): Promise<RoleDto> {
    const user = await this.userModel.findByPk(roleData.userId);
    const assignedRole = RoleEnum[roleData.value];
    if (!user) {
      throw new NotFoundException('Failed! User or role does not exist');
    }
    await user.update({ role: assignedRole });
    return roleData;
  }

  async assignAccount(accountData: AccountDto): Promise<AccountDto> {
    const user = await this.userModel.findByPk(accountData.userId);
    const assignedAccount = AccountEnum[accountData.value];
    if (!user) {
      throw new NotFoundException('Failed! User or account does not exist');
    }
    await user.update({ account: assignedAccount });
    return accountData;
  }
}
