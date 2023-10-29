import { Injectable } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { EventEntity } from './event.entity';

@Injectable()
export class EventService {
    constructor(private readonly eventRepository: EventRepository) {}

    async getEvents(): Promise<EventEntity[]> {
      return await this.eventRepository.find();
    }
}
