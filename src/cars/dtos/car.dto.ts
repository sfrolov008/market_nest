import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MakeDto {
  @ApiProperty({
    example: 'BMW',
  })
  @IsString()
  value: string;
}

export class ModelDto {
  @ApiProperty({
    example: 'X5',
  })
  @IsString()
  value: string;
}

export class GenDto {
  @ApiProperty({
    example: '4',
  })
  @IsString()
  value: string;
}
