import { Injectable } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { EventEntity } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventService {
    constructor(private readonly eventRepository: EventRepository) {}

    async getEvents(): Promise<EventEntity[]> {
      return await this.eventRepository.find();
    }

    async createEvent(createEventDto: CreateEventDto): Promise<EventEntity> {
        const { name, surname, email, date } = createEventDto
        const newEvent: EventEntity = this.eventRepository.create({
            name, surname, email, date
        })
        await this.eventRepository.save(newEvent)
        return newEvent
      }
}
