import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EventEntity } from './event.entity';


const mockEventService = {
  getEvents: jest.fn(),
  createEvent: jest.fn(),
  getEventById: jest.fn(),
  deleteById: jest.fn(),
  updateEvent: jest.fn()
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
    it('should create a new event and return it, with correct params', async () => {
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

  describe('deleteById', () => {
    it('should successfully deleteById', async () => {
      jest
        .spyOn(service, 'deleteById')
        .mockResolvedValue();

      await controller.deleteById(mockEvent.id);

      expect(service.deleteById).toHaveBeenCalledWith(mockEvent.id);
    });

    it('throws NotFound exception if no element is found', async () => {
      const mockError = new NotFoundException(
        `Event with id: ${mockEvent.id} not found`,
      );

      jest.spyOn(service, 'deleteById').mockRejectedValue(mockError);
      expect(service.deleteById).toHaveBeenCalled();
      await expect(
        controller.deleteById(mockEvent.id),
      ).rejects.toThrow(
        new NotFoundException(`Event with id: ${mockEvent.id} not found`),
      );
    });
  });

  describe('updateEvent', () => {
    it('should succesfully updateEvent when all query params are provided', async () => {
      const query  = {    
        name: 'Maria', 
        surname: 'Test1', 
        email: 'email@test1.com', 
        date: new Date(1995, 11, 15)
      }
      const updatedEvent: EventEntity = {    
        id: '1befbb09-782a-4924-9e51-98f8ec8069ee',      
        name: 'Maria', 
        surname: 'Test1', 
        email: 'email@test1.com', 
        date: new Date(1995, 11, 15)
      }
      jest
        .spyOn(service, 'updateEvent')
        .mockResolvedValue(updatedEvent);

      const result = await controller.updateEvent(
        mockEvent.id,
        query,
      );
      expect(result).toEqual(updatedEvent);
    });

    it('should succesfully updateEvent when some query params are provided', async () => {
      const query  = {    
        name: 'Maria', 
        surname: 'Test1', 
      }
      const updatedEvent: EventEntity = {    
        id: '1befbb09-782a-4924-9e51-98f8ec8069ee',      
        name: 'Maria', 
        surname: 'Test1', 
        email: mockEvent.email, 
        date: mockEvent.date
      }
      jest
        .spyOn(service, 'updateEvent')
        .mockResolvedValue(updatedEvent);

      const result = await controller.updateEvent(
        mockEvent.id,
        query,
      );
      expect(result).toEqual(updatedEvent);
    });

    it('should throw BadRequest when none params are provided', async () => {
      const query  = {}
      jest
        .spyOn(service, 'updateEvent').mockRejectedValue(new BadRequestException('No valid query parameters provided'));

        await expect(controller.updateEvent(mockEvent.id, query)).rejects.toThrow(
          new BadRequestException('No valid query parameters provided'),
        );
    });
  });

});