import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EventEntity } from '../../domain/model/event.entity';
import { CreateEventDto } from 'src/event/port/incoming/dto/create-event.dto';
import {
  UpdateEventQueryDto,
  mapUpdateQueryToEntity,
} from '../../port/incoming/dto/update-event-query.dto';
import { IEventRepository } from 'src/event/port/outgoing/IEventRepository';

@Injectable()
export class EventRepository
  extends Repository<EventEntity>
  implements IEventRepository
{
  constructor(private dataSource: DataSource) {
    super(EventEntity, dataSource.createEntityManager());
  }
  async getEvents(): Promise<EventEntity[]> {
    return await this.find({
      order: { date: 'DESC', createdAt: 'ASC' },
    });
  }
  async createEvent(createEventDto: CreateEventDto): Promise<EventEntity> {
    const { name, surname, email, date } = createEventDto;
    const newEvent: EventEntity = this.create({
      name,
      surname,
      email,
      date,
    });
    await this.save(newEvent);
    return newEvent;
  }

  async getEventById(id: string): Promise<EventEntity> {
    const specificEvent = await this.findOne({
      where: {
        id,
      },
    });
    if (!specificEvent) {
      throw new NotFoundException(`Event with id: ${id} not found`);
    }
    return specificEvent;
  }

  async updateEvent(
    id: string,
    query: UpdateEventQueryDto,
  ): Promise<EventEntity> {
    const specificEvent: EventEntity = await this.getEventById(id);
    if (Object.keys(query).length === 0) {
      throw new BadRequestException('No valid query parameters provided');
    }

    const mappedUpdate = mapUpdateQueryToEntity(query);
    Object.assign(specificEvent, mappedUpdate);

    await this.save(specificEvent);

    return specificEvent;
  }

  async deleteById(id: string): Promise<void> {
    const result = await this.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Event with id: ${id} not found`);
    }
  }

  async deleteAll(): Promise<void> {
    const result = await this.delete({});
    if (result.affected === 0) {
      throw new NotFoundException('No events found to delete');
    }
  }
}
