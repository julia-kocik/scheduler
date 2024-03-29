import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventRepository } from '../../../../event/adapters/outgoing/event.repository';
import { CreateEventDto } from '../../../../event/port/incoming/dto/create-event.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource, DeleteResult } from 'typeorm';
import { validate } from 'class-validator';
import { EventEntity } from '../../../../event/domain/model/event.entity';

const mockDataSource = {
  find: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  createEntityManager: jest.fn(),
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

describe('Even Repository', () => {
  let repository: EventRepository;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventRepository,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    repository = module.get<EventRepository>(EventRepository);
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(dataSource).toBeDefined();
  });

  describe('getEvents', () => {
    it('should successfully return all events', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([mockEvent]);
      const result = await repository.getEvents();
      expect(result).toEqual([mockEvent]);
    });
  });

  describe('create Event', () => {
    it('should successfully create an event with correct params', async () => {
      jest.spyOn(repository, 'create').mockReturnValue(mockEvent);

      jest.spyOn(repository, 'save').mockResolvedValue(mockEvent);
      const result = await repository.createEvent(mockEventDto);
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockEvent);
    });

    it('should throw error when email is in an invalid format', async () => {
      const date = new Date(1995, 11, 17);
      const createdAt = new Date(2023, 11, 14);

      const event = new EventEntity(
        '123',
        'Jane',
        'Smith',
        'invalidemail',
        date,
        createdAt,
      );

      const errors = await validate(event);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]?.constraints?.isEmail).toEqual('Invalid email format');
    });

    it('should not pass validation when properties are empty', async () => {
      // @ts-ignore
      const emptyDto = new CreateEventDto();

      const errors = await validate(emptyDto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('GetEventById', () => {
    it('should successfully return event with a given id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockEvent);
      const result = await repository.getEventById(
        '1befbb09-782a-4924-9e51-98f8ec8069ee',
      );
      expect(repository.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockEvent);
    });

    it('should should throw NotFoundException when event was not found', async () => {
      const mockError = new NotFoundException(
        `Event with id 1234 does not exist`,
      );
      jest.spyOn(repository, 'findOne').mockRejectedValue(mockError);

      await expect(repository.getEventById(mockEvent.id)).rejects.toThrow(
        new NotFoundException(`Event with id 1234 does not exist`),
      );
    });
  });

  describe('deleteById', () => {
    it('should succesfully deleteById', async () => {
      const mockResult: DeleteResult = { affected: 1, raw: [] };

      jest.spyOn(repository, 'delete').mockResolvedValue(mockResult);

      await expect(
        repository.deleteById(mockEvent.id),
      ).resolves.toBeUndefined();
    });

    it('throws NotFound exception if no element is found', async () => {
      const mockResult: DeleteResult = { affected: 0, raw: [] };

      jest.spyOn(repository, 'delete').mockResolvedValue(mockResult);

      await expect(repository.deleteById(mockEvent.id)).rejects.toThrow(
        new NotFoundException(`Event with id: ${mockEvent.id} not found`),
      );
    });
  });

  describe('deleteAll', () => {
    it('should succesfully deleteAll', async () => {
      const mockResult: DeleteResult = { affected: 1, raw: [] };

      jest.spyOn(repository, 'delete').mockResolvedValue(mockResult);

      await expect(repository.deleteAll()).resolves.toBeUndefined();
    });

    it('throws NotFound exception if no elements to delete', async () => {
      const mockResult: DeleteResult = { affected: 0, raw: [] };

      jest.spyOn(repository, 'delete').mockResolvedValue(mockResult);

      await expect(repository.deleteAll()).rejects.toThrow(
        new NotFoundException('No events found to delete'),
      );
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
      jest.spyOn(repository, 'getEventById').mockResolvedValue(mockEvent);
      jest.spyOn(repository, 'save').mockResolvedValue(mockEvent);

      const result = await repository.updateEvent(mockEvent.id, query);
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
      jest.spyOn(repository, 'getEventById').mockResolvedValue(mockEvent);
      jest.spyOn(repository, 'save').mockResolvedValue(mockEvent);

      const result = await repository.updateEvent(mockEvent.id, query);
      expect(result).toEqual(updatedEvent);
    });

    it('should throw BadRequest when none params are provided', async () => {
      const query = {};
      jest.spyOn(repository, 'getEventById').mockResolvedValue(mockEvent);

      await expect(repository.updateEvent(mockEvent.id, query)).rejects.toThrow(
        new BadRequestException('No valid query parameters provided'),
      );
    });
  });
});
