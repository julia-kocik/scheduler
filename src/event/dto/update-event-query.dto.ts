import { IsString, IsOptional, IsDateString, IsEmail } from 'class-validator';

export class UpdateEventQueryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  surname?: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional()
  email?: string;

  @IsDateString({ each: true, always: false })
  @IsOptional()
  date?: Date;
}