import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  surname: string;

  @Column()
  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Column()
  @ApiProperty()
  date: Date;
  
  constructor(
    id: string,
    name: string,
    surname: string,
    email: string,
    date: Date
  ) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.date = date;
  }
}