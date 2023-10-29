import { EventEntity } from './event.entity';
import { EventService } from './event.service';
import { Controller, Get } from '@nestjs/common';

@Controller('event')
export class EventController {
    constructor(private eventService: EventService) {}

    @Get()
    getEvents(): Promise<EventEntity[]> {
      return this.eventService.getEvents();
    }
  
}
