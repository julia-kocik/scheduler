import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { EventEntity } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventQueryDto } from './dto/update-event-query.dto';

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

    async getEventById(id: string): Promise<EventEntity> {
      const specificEvent = await this.eventRepository.findOne({ where: {
        id
      }});
      if(!specificEvent) {
        throw new NotFoundException(`Event with id: ${id} not found`);
      }
      return specificEvent
    }

    async deleteById(id: string): Promise<void> {
      const result = await this.eventRepository.delete({id})
      if(result.affected === 0) {
        throw new NotFoundException(`Event with id: ${id} not found`)
      }
    }

    async updateEvent(
      id: string,
      query: UpdateEventQueryDto,
    ): Promise<EventEntity> {
      const specificEvent = await this.getEventById(id);
      if (Object.keys(query).length === 0) {
        throw new BadRequestException('No valid query parameters provided');
      }
      for (const prop of Object.keys(query)) {
        specificEvent[prop] = query[prop];
      }
    
      await this.eventRepository.save(specificEvent);
    
      return specificEvent;
    }
    
}
