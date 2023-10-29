import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';


const mockEventService = {
  getEvents: jest.fn()
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
    date: new Date()
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
});