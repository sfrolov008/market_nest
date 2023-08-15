import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class AccountDto {
  @ApiProperty({
    example: 'c3d9f09c-57b3-48f4-afe9-6bfa5d4a0e53',
    description: 'user ID',
  })
  @IsUUID('all', { message: 'invalid UUID format' })
  userId: string;

  @ApiProperty({
    example: 'premium',
    description: 'account value',
  })
  @IsString({ message: 'should be a string' })
  value: string;
}
