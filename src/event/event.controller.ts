import { ApiQuery } from '@nestjs/swagger';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventQueryDto } from './dto/update-event-query.dto';
import { EventEntity } from './event.entity';
import { EventService } from './event.service';
import { Body, Controller, Get, Param, Post, Delete, Patch, Query, BadRequestException } from '@nestjs/common';

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
    
    @Get('/:id')
    getEventById(
      @Param('id') id: string,
    ): Promise<EventEntity> {
      return this.eventService.getEventById(id);
    }

    @Patch('/:id')
    @ApiQuery({ name: 'name', type: String, required: false })
    @ApiQuery({ name: 'surname', type: String, required: false })
    @ApiQuery({ name: 'email', type: String, required: false })
    @ApiQuery({ name: 'date', type: Date, required: false })
    updateEvent(
      @Param('id') id: string,
      @Query() query: UpdateEventQueryDto, 
    ): Promise<EventEntity> {
      return this.eventService.updateEvent(id, query);
    }

    @Delete('/:id')
    deleteById(@Param('id') id: string): Promise<void> {
      return this.eventService.deleteById(id);
    }

    @Delete()
    deleteAll(): Promise<void> {
      return this.eventService.deleteAll();
    }
}
