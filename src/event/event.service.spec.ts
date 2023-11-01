import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventService } from './event.service';
import { EventRepository } from './event.repository';
import { CreateEventDto } from './dto/create-event.dto';


const mockEventService = {
  find: jest.fn(),
  save: jest.fn(),
  create: jest.fn()
};


interface mockEventInterface {
  id: string
  name: string
  surname: string
  email: string
  date: Date
}

const mockEvent: mockEventInterface = {
    id: '1befbb09-782a-4924-9e51-98f8ec8069ee',
    name: 'Julia',
    surname: 'Test',
    email: 'email@email.com',
    date: new Date(1995, 11, 17)
}

const mockEventDto: CreateEventDto = {
  name: 'Julia',
  surname: 'Test',
  email: 'email@email.com',
  date: new Date(1995, 11, 17)
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
          useValue: mockEventService,
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
      jest
        .spyOn(repository, 'find')
        .mockResolvedValue([mockEvent]);
      const result = await service.getEvents();
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([mockEvent]);
    });
  });

  describe('create Event', () => {
    it('should successfully create an event with correct params', async () => {

      jest
      .spyOn(repository, 'create')
      .mockReturnValue(mockEvent);

      jest
        .spyOn(repository, 'save')
        .mockResolvedValue(mockEvent);
      const result = await service.createEvent(mockEventDto);
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockEvent);
    });
  });
});