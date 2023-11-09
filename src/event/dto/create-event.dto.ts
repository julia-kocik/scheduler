import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  surname: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  date: Date;

  constructor(
    name: string,
    surname: string,
    email: string,
    date: Date
  ) {
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.date = date;
  }
}