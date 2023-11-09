import { IsEmail } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Column()
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