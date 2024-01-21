import { IsString, IsOptional, IsDateString, IsEmail } from 'class-validator';
import { EventEntity } from 'src/event/domain/model/event.entity';

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

export function mapUpdateQueryToEntity(
  query: UpdateEventQueryDto,
): Partial<EventEntity> {
  const mapped: Partial<EventEntity> = {};

  if (query.name !== undefined) {
    mapped.name = query.name;
  }

  if (query.surname !== undefined) {
    mapped.surname = query.surname;
  }

  if (query.email !== undefined) {
    mapped.email = query.email;
  }

  if (query.date !== undefined) {
    mapped.date = query.date;
  }

  return mapped;
}
