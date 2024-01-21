import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './domain/model/event.entity';
import { EventService } from './application/event.service';
import { EventRepository } from './adapters/outgoing/event.repository';
import { EventController } from './adapters/incoming/event.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity])],
  providers: [EventService, EventRepository],
  controllers: [EventController],
})
export class EventModule {}
