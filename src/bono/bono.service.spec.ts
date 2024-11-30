import { Test, TestingModule } from '@nestjs/testing';
import { BonoService } from './bono.service';
import { ClaseService } from '../clase/clase.service';
import { UsuarioService } from '../usuario/usuario.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BonoEntity } from './bono.entity';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { BonoDto } from './bono.dto';
import { Role } from '../usuario/role.enum';
import { Long } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { UsuarioEntity } from '../usuario/usuario.entity';

describe('BonoService', () => {
  let service: BonoService;
  let repository: Repository<BonoEntity>;
  let claseService: ClaseService;
  let usuarioService: UsuarioService;

  const mockBono: BonoEntity = {
    id: 1 as unknown as Long,
    monto: 2.5,
    palabraclave: 'palabra',
    calificacion: 3,
    clase: null,
    usuario: null,
  };

  const mockClase = {
    id: 1 as unknown as Long,
    nombre: 'Introducción a la Programación',
  };

  const mockUsuario = {
    id: 1 as unknown as Long,
    nombre: 'Mariana Marin',
    rol: Role.PROFESOR,
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockClaseService = {
    findOne: jest.fn(),
  };

  const mockUsuarioService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BonoService,
        {
          provide: getRepositoryToken(BonoEntity),
          useValue: mockRepository, // Repositorio mock de BonoEntity
        },
        {
          provide: ClaseService,
          useValue: mockClaseService, // Servicio mock de ClaseService
        },
        {
          provide: UsuarioService,
          useValue: mockUsuarioService, // Servicio mock de UsuarioService
        },
        {
          provide: getRepositoryToken(UsuarioEntity), // Repositorio mock de UsuarioEntity
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();
  
    service = module.get<BonoService>(BonoService);
    repository = module.get<Repository<BonoEntity>>(getRepositoryToken(BonoEntity));
    claseService = module.get<ClaseService>(ClaseService);
    usuarioService = module.get<UsuarioService>(UsuarioService);
  });
  

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of bonos', async () => {
      mockRepository.find.mockResolvedValue([mockBono]);
      const result = await service.findAll();
      expect(result).toEqual([mockBono]);
      expect(mockRepository.find).toHaveBeenCalledWith({ relations: ['clase', 'usuario'] });
    });
  });

  describe('findOne', () => {
    it('should return a bono when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockBono);
      const result = await service.findOne(1 as unknown as Long); // Usamos 'unknown' para forzar el tipo
      expect(result).toEqual(mockBono);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['clase', 'usuario'],
      });
    });

    it('should throw an error when bono is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      try {
        await service.findOne(1 as unknown as Long);
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe('The bono with the given id was not found');
      }
    });
  });

  describe('create', () => {
    const bonoDto: BonoDto = {
      monto: 2.5,
      calificacion: 2.5,
      palabraclave: 'palabra',
      claseId: 1 as unknown as Long,
      usuarioId: 1 as unknown as Long,
    };

    it('should create and return a new bono', async () => {
      mockClaseService.findOne.mockResolvedValue(mockClase);
      mockUsuarioService.findOne.mockResolvedValue(mockUsuario);
      mockRepository.save.mockResolvedValue(mockBono);

      console.log(bonoDto.monto);

      const result = await service.create(bonoDto);
      expect(result).toEqual(mockBono);
      expect(mockClaseService.findOne).toHaveBeenCalledWith(1);
      expect(mockUsuarioService.findOne).toHaveBeenCalledWith(1);
      expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        monto: bonoDto.monto
      }));
    });

    it('should throw an error if clase is not found', async () => {
      mockClaseService.findOne.mockResolvedValue(null);
      try {
        await service.create(bonoDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe('The clase with the given id was not found');
      }
    });

    it('should throw an error if usuario is not found', async () => {
      mockClaseService.findOne.mockResolvedValue(mockClase);
      mockUsuarioService.findOne.mockResolvedValue(null);
      try {
        await service.create(bonoDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe('The usuario with the given id was not found');
      }
    });

    it('should throw an error if monto is invalid', async () => {
      mockClaseService.findOne.mockResolvedValue(mockClase);
      mockUsuarioService.findOne.mockResolvedValue(mockUsuario);
      try {
        await service.create({ ...bonoDto, monto: -500 });
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe('The monto is not valid');
      }
    });
  });

  describe('delete', () => {
    it('should delete a bono when conditions are met', async () => {
      mockRepository.findOne.mockResolvedValue(mockBono);
      await service.delete(1 as unknown as Long); // Usamos 'unknown' para forzar el tipo
      expect(mockRepository.remove).toHaveBeenCalledWith(mockBono);
    });

    it('should throw an error if bono is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      try {
        await service.delete(1 as unknown as Long);
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe('The bono with the given id was not found');
      }
    });

    it('should throw an error if bono calificacion > 4', async () => {
      mockRepository.findOne.mockResolvedValue({ ...mockBono, calificacion: 5 });
      try {
        await service.delete(1 as unknown as Long);
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe("The bono can´t be deleted");
      }
    });
  });
});
