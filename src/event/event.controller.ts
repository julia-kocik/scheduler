import { CreateEventDto } from './dto/create-event.dto';
import { EventEntity } from './event.entity';
import { EventService } from './event.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('event')
export class EventController {
    constructor(private eventService: EventService) {}

    @Get()
    getEvents(): Promise<EventEntity[]> {
      return this.eventService.getEvents();
    }

    @Post()
    createEvent(@Body() createEventDto: CreateEventDto): Promise<EventEntity> {
        return this.eventService.createEvent(createEventDto);
      }
  
}
