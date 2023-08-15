import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

import { EMAIL, PASSWORD, PHONE } from '../../common/constants/regex.constants';

export class UserDto {
  @ApiProperty({
    example: 'John',
    description: 'user name',
  })
  @IsString({ message: 'should be a string' })
  name: string;

  @ApiProperty({
    example: 'john@mail.com',
    description: 'user email',
  })
  @IsString({ message: 'incorrect email' })
  @IsEmail({}, { message: 'invalid email format' })
  @Matches(EMAIL, { message: 'invalid email format' })
  email: string;

  @ApiProperty({
    example: '+380501234567',
    description: 'user phone',
  })
  @IsString({ message: 'should be a string' })
  @Matches(PHONE, { message: 'invalid phone format' })
  phone: string;

  @ApiProperty({
    example: 'Qwerty123',
    description: 'user password',
  })
  @IsString({ message: 'should be a string' })
  @Matches(PASSWORD, { message: 'invalid password format' })
  password: string;

  @ApiProperty({
    description: 'user avatar',
  })
  avatar?: string;
}
