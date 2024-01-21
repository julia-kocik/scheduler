import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventRepository } from '../adapters/outgoing/event.repository';
import { EventEntity } from '../domain/model/event.entity';
import { CreateEventDto } from '../port/incoming/dto/create-event.dto';
import { UpdateEventQueryDto } from '../port/incoming/dto/update-event-query.dto';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  async getEvents(): Promise<EventEntity[]> {
    return await this.eventRepository.getEvents();
  }

  async createEvent(createEventDto: CreateEventDto): Promise<EventEntity> {
    return await this.eventRepository.createEvent(createEventDto);
  }

  async getEventById(id: string): Promise<EventEntity> {
    return await this.eventRepository.getEventById(id);
  }

  async updateEvent(
    id: string,
    query: UpdateEventQueryDto,
  ): Promise<EventEntity> {
    return await this.eventRepository.updateEvent(id, query);
  }

  async deleteById(id: string): Promise<void> {
    return await this.eventRepository.deleteById(id)
  }

  async deleteAll(): Promise<void> {
    return await this.eventRepository.deleteAll()
  }
}
