import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EventEntity } from './event.entity';


@Injectable()
export class EventRepository extends Repository<EventEntity> {
  constructor(private dataSource: DataSource) {
    super(EventEntity, dataSource.createEntityManager());
  }
}