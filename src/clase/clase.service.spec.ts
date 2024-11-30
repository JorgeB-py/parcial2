import { Test, TestingModule } from '@nestjs/testing';
import { ClaseService } from './clase.service';
import { Long, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClaseEntity } from './clase.entity';
import { BusinessLogicException } from '../shared/errors/business-errors';

describe('ClaseService', () => {
  let service: ClaseService;
  let repository: Repository<ClaseEntity>;

  const mockClase: ClaseEntity = {
    id: 1 as unknown as Long,
    codigo: 'CS101',
    nombre: 'Introducción a la Programación',
    numerocreditos: 3,
    bonos: [],
    usuario: null,
  };

  const mockRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClaseService,
        {
          provide: getRepositoryToken(ClaseEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ClaseService>(ClaseService);
    repository = module.get<Repository<ClaseEntity>>(getRepositoryToken(ClaseEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a clase when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockClase);

      const result = await service.findOne(1 as unknown as Long);
      expect(result).toEqual(mockClase);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['bonos', 'usuario'],
      });
    });

    it('should throw an error when clase is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      try {
        await service.findOne(1 as unknown as Long);
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe("The clase with the given id was not found");
      }
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['bonos', 'usuario'],
      });
    });
  });

  describe('create', () => {
    it('should create and return a new clase', async () => {
      mockRepository.save.mockResolvedValue(mockClase);

      const result = await service.create(mockClase);
      expect(result).toEqual(mockClase);
      expect(mockRepository.save).toHaveBeenCalledWith(mockClase);
    });

    it('should throw an error if creation fails', async () => {
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(mockClase)).rejects.toThrow('Database error');
      expect(mockRepository.save).toHaveBeenCalledWith(mockClase);
    });
  });
});
