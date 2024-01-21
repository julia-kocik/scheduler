import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventService } from '../../../event/application/event.service';
import { EventRepository } from '../../../event/adapters/outgoing/event.repository';
import { CreateEventDto } from '../../../event/port/incoming/dto/create-event.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { EventEntity } from '../../../event/domain/model/event.entity';
import { validate } from 'class-validator';

const mockEventRepository = {
  getEvents: jest.fn(),
  createEvent: jest.fn(),
  getEventById: jest.fn(),
  updateEvent: jest.fn(),
  deleteById: jest.fn(),
  deleteAll: jest.fn(),
};

interface mockEventInterface {
  id: string;
  name: string;
  surname: string;
  email: string;
  date: Date;
  createdAt: Date;
}

const mockEvent: mockEventInterface = {
  id: '1befbb09-782a-4924-9e51-98f8ec8069ee',
  name: 'Julia',
  surname: 'Test',
  email: 'email@email.com',
  date: new Date(1995, 11, 17),
  createdAt: new Date(2023, 11, 14),
};

const mockEventDto: CreateEventDto = {
  name: 'Julia',
  surname: 'Test',
  email: 'email@email.com',
  date: new Date(1995, 11, 17),
};

describe('EventService', () => {
  let service: EventService;
  let repository: EventRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getRepositoryToken(EventRepository),
          useValue: mockEventRepository,
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    repository = module.get<EventRepository>(
      getRepositoryToken(EventRepository),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('getEvents', () => {
    it('should successfully return all events', async () => {
      jest.spyOn(repository, 'getEvents').mockResolvedValue([mockEvent]);
      const result = await service.getEvents();
      expect(repository.getEvents).toHaveBeenCalled();
      expect(result).toEqual([mockEvent]);
    });
  });

  describe('create Event', () => {
    it('should successfully create an event with correct params', async () => {
      jest.spyOn(repository, 'createEvent').mockResolvedValue(mockEvent);
      const result = await service.createEvent(mockEventDto);
      expect(result).toEqual(mockEvent);
    });
  });

  describe('GetEventById', () => {
    it('should successfully return event with a given id', async () => {
      jest.spyOn(repository, 'getEventById').mockResolvedValue(mockEvent);
      const result = await service.getEventById(
        '1befbb09-782a-4924-9e51-98f8ec8069ee',
      );
      expect(result).toEqual(mockEvent);
    });

    it('should should throw NotFoundException when event was not found', async () => {
      const mockError = new NotFoundException(
        `Event with id 1234 does not exist`,
      );
      jest.spyOn(repository, 'getEventById').mockRejectedValue(mockError);

      await expect(service.getEventById(mockEvent.id)).rejects.toThrow(
        new NotFoundException(`Event with id 1234 does not exist`),
      );
    });
  });

  describe('deleteById', () => {
    it('should successfully deleteById', async () => {
      jest.spyOn(repository, 'deleteById').mockResolvedValue();

      await service.deleteById(mockEvent.id);

      expect(repository.deleteById).toHaveBeenCalledWith(mockEvent.id);
    });

    it('throws NotFound exception if no element is found', async () => {
      const mockError = new NotFoundException(
        `Event with id: ${mockEvent.id} not found`,
      );

      jest.spyOn(repository, 'deleteById').mockRejectedValue(mockError);
      expect(repository.deleteById).toHaveBeenCalled();
      await expect(service.deleteById(mockEvent.id)).rejects.toThrow(
        new NotFoundException(`Event with id: ${mockEvent.id} not found`),
      );
    });
  });

  describe('deleteAll', () => {
    it('should successfully deleteAll', async () => {
      jest.spyOn(repository, 'deleteAll').mockResolvedValue();

      await service.deleteAll();

      expect(repository.deleteAll).toHaveBeenCalled();
    });

    it('throws NotFound exception if no element is found', async () => {
      const mockError = new NotFoundException('No events found to delete');

      jest.spyOn(repository, 'deleteAll').mockRejectedValue(mockError);
      expect(repository.deleteAll).toHaveBeenCalled();
      await expect(service.deleteAll()).rejects.toThrow(mockError);
    });
  });

  describe('updateEvent', () => {
    it('should succesfully updateEvent when all query params are provided', async () => {
      const query = {
        name: 'Maria',
        surname: 'Test1',
        email: 'email@test1.com',
        date: new Date(1995, 11, 15),
      };
      const updatedEvent: EventEntity = {
        id: '1befbb09-782a-4924-9e51-98f8ec8069ee',
        name: 'Maria',
        surname: 'Test1',
        email: 'email@test1.com',
        date: new Date(1995, 11, 15),
        createdAt: new Date(2023, 11, 14),
      };
      jest.spyOn(repository, 'updateEvent').mockResolvedValue(updatedEvent);

      const result = await service.updateEvent(mockEvent.id, query);
      expect(result).toEqual(updatedEvent);
    });

    it('should succesfully updateEvent when some query params are provided', async () => {
      const query = {
        name: 'Maria',
        surname: 'Test1',
      };
      const updatedEvent: EventEntity = {
        id: '1befbb09-782a-4924-9e51-98f8ec8069ee',
        name: 'Maria',
        surname: 'Test1',
        email: mockEvent.email,
        date: mockEvent.date,
        createdAt: new Date(2023, 11, 14),
      };
      jest.spyOn(repository, 'updateEvent').mockResolvedValue(updatedEvent);

      const result = await service.updateEvent(mockEvent.id, query);
      expect(result).toEqual(updatedEvent);
    });

    it('should throw BadRequest when none params are provided', async () => {
      const query = {};
      jest
        .spyOn(repository, 'updateEvent')
        .mockRejectedValue(
          new BadRequestException('No valid query parameters provided'),
        );

      await expect(service.updateEvent(mockEvent.id, query)).rejects.toThrow(
        new BadRequestException('No valid query parameters provided'),
      );
    });
  });
});
