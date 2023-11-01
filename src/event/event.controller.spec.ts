import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { NotFoundException } from '@nestjs/common';


const mockEventService = {
  getEvents: jest.fn(),
  createEvent: jest.fn(),
  getEventById: jest.fn()
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
};

const mockEventDto: CreateEventDto = {
  name: 'Julia',
  surname: 'Test',
  email: 'email@email.com',
  date: new Date(1995, 11, 17)
};


describe('Event Controller', () => {
  let controller: EventController;
  let service: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        {
          provide: EventService,
          useValue: mockEventService,
        },
      ],
    }).compile();

    controller = module.get<EventController>(EventController);
    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getEvents', () => {
    it('should successfully return all events', async () => {
      jest
        .spyOn(service, 'getEvents')
        .mockResolvedValue([mockEvent]);
      const result = await controller.getEvents();
      expect(service.getEvents).toHaveBeenCalled();
      expect(result).toEqual([mockEvent]);
    });
  });

  describe('create Event', () => {
    it('should create a new trip and return it, with correct params', async () => {
      jest
        .spyOn(service, 'createEvent')
        .mockResolvedValue(mockEvent);
      const result = await controller.createEvent(mockEventDto);
      expect(result).toEqual(mockEvent);
    });
  });

  describe('getEventById', () => {
    it('should successfully return event with a given id', async () => {
      jest
        .spyOn(service, 'getEventById')
        .mockResolvedValue(mockEvent);
      const result = await controller.getEventById('1befbb09-782a-4924-9e51-98f8ec8069ee');
      expect(result).toEqual(mockEvent);
    });

    it('should should throw NotFoundException when event was not found', async () => {
      const mockError = new NotFoundException(
        `Event with id 1234 does not exist`,
      );
      jest.spyOn(service, 'getEventById').mockRejectedValue(mockError);

      await expect(controller.getEventById(mockEvent.id)).rejects.toThrow(
        new NotFoundException(`Event with id 1234 does not exist`),
      );
    });
  });
});