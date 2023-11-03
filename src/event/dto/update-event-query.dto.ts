import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateEventQueryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  surname?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsDateString({ each: true, always: false })
  @IsOptional()
  date?: Date;
}