import { DataSource } from 'typeorm';
import { CreateEventDto } from 'src/event/port/incoming/dto/create-event.dto';
import { UpdateEventQueryDto } from 'src/event/port/incoming/dto/update-event-query.dto';
import { EventEntity } from '../../domain/model/event.entity';

export interface IEventRepository {
  getEvents(): Promise<EventEntity[]>;

  createEvent(createEventDto: CreateEventDto): Promise<EventEntity>;

  getEventById(id: string): Promise<EventEntity>;

  updateEvent(id: string, query: UpdateEventQueryDto): Promise<EventEntity>;

  deleteById(id: string): Promise<void>;

  deleteAll(): Promise<void>;
}
