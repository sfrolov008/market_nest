import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class StatusDto {
  @ApiProperty({
    example: 'c3d9f09c-57b3-48f4-afe9-6bfa5d4a0e53',
    description: 'ID of the advertisement',
  })
  @IsNotEmpty()
  adsId: string;

  @ApiProperty({
    example: 'active',
    description: 'Status value',
  })
  @IsString()
  @IsNotEmpty()
  value: string;
}
