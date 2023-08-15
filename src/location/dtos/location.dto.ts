import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegionDto {
  @ApiProperty({
    example: 'Kharkivska',
  })
  @IsString()
  value: string;
}
export class CityDto {
  @ApiProperty({
    example: 'Kharkiv',
  })
  @IsString()
  value: string;
}
