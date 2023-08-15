import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { User } from './entities/users.model';
import { UserDto } from './dtos/user.dto';
import { UploadFilePipe } from '../common/pipes/upload-file.pipe';
import { RoleDto } from './dtos/role.dto';
import { AccountDto } from './dtos/account.dto';
import { Roles } from '../common/decorators/role.decorator';
import { RolesGuard } from '../auth/guards/role-auth.guard';

@ApiTags('User')
@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, type: User })
  @Roles('admin')
  @Post()
  async create(
    @Res() res: Response,
    @Body() createUserDto: UserDto,
  ): Promise<Response<User>> {
    return res
      .status(HttpStatus.CREATED)
      .json(await this.userService.create(createUserDto));
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [User] })
  @Roles('admin')
  @Get()
  async getAll(@Res() res: Response): Promise<Response<User[]>> {
    return res.status(HttpStatus.OK).json(await this.userService.getAll());
  }

  @ApiOperation({ summary: 'Get one user' })
  @ApiResponse({ status: 200, type: User })
  @Roles('seller', 'manager', 'admin')
  @Get('/:id')
  async getOne(
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<Response<User>> {
    return res.status(HttpStatus.OK).json(await this.userService.getOne(id));
  }

  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({ status: 200, type: User })
  @Roles('admin')
  @Patch('/:id')
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateUserDto: Partial<UserDto>,
  ): Promise<Response<User>> {
    return res
      .status(HttpStatus.OK)
      .json(await this.userService.update(id, updateUserDto));
  }

  @ApiOperation({ summary: 'Update auth user' })
  @ApiResponse({ status: 200, type: User })
  @Roles('seller')
  @Patch('/:id/seller')
  async updateAuthUser(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateUserDto: Partial<UserDto>,
  ): Promise<Response<User>> {
    const authData = req.headers.authorization;
    return res
      .status(HttpStatus.OK)
      .json(await this.userService.updateAuthUser(id, authData, updateUserDto));
  }

  @ApiOperation({ summary: 'Delete one user by id' })
  @ApiResponse({ status: 204 })
  @Roles('admin')
  @Delete('/:id')
  async remove(@Res() res: Response, @Param('id') id: string): Promise<void> {
    await this.userService.remove(id);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @ApiOperation({ summary: 'Upload user avatar' })
  @ApiResponse({ status: 200 })
  @Roles('seller', 'manager', 'admin')
  @Post('avatar/:id')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @Res() res: Response,
    @Param('id') userId: string,
    @UploadedFile(UploadFilePipe) file: Express.Multer.File,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.userService.uploadAvatar(userId, file));
  }

  @ApiOperation({ summary: 'Set user role' })
  @ApiResponse({ status: 200 })
  @Roles('manager', 'admin')
  @Patch('/role/:id')
  async assignRole(@Res() res: Response, @Body() roleData: RoleDto) {
    return res
      .status(HttpStatus.OK)
      .json(await this.userService.assignRole(roleData));
  }

  @ApiOperation({ summary: 'Set user account' })
  @ApiResponse({ status: 200 })
  @Roles('manager', 'admin')
  @Patch('/account/:id')
  async assignAccount(@Res() res: Response, @Body() accountData: AccountDto) {
    return res
      .status(HttpStatus.OK)
      .json(await this.userService.assignAccount(accountData));
  }
}
