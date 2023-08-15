import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

import { EMAIL, PASSWORD, PHONE } from '../../common/constants/regex.constants';

export class RegistrationDto {
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
  @IsEmail()
  @Matches(EMAIL, { message: 'invalid email format' })
  email: string;

  @ApiProperty({
    example: '+380501234567',
    description: 'user phone',
  })
  @IsString()
  @Matches(PHONE, { message: 'invalid phone format' })
  phone: string;
  @ApiProperty({
    example: 'Qwerty123',
    description: 'user password',
  })
  @IsString({ message: 'incorrect password' })
  @Matches(PASSWORD, { message: 'invalid password format' })
  password: string;

  @ApiProperty({
    description: 'user avatar',
  })
  avatar?: string;
}

export class LoginDto {
  @ApiProperty({
    example: 'john@mail.com',
    description: 'user email',
  })
  @IsString({ message: 'incorrect email' })
  @IsEmail()
  @Matches(EMAIL, { message: 'invalid email format' })
  email: string;
  @IsString({ message: 'incorrect password' })
  @Matches(PASSWORD, { message: 'invalid password format' })
  password: string;
}
