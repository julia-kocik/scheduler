import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty()
  @IsDateString()
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