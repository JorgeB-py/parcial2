import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { BonoService } from '../bono/bono.service';
import { ClaseService } from '../clase/clase.service';
import { Long, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { UsuarioDto } from './usuario.dto';
import { Role } from './role.enum';

describe('UsuarioService', () => {
  let usuarioService: UsuarioService;
  let usuarioRepository: Repository<UsuarioEntity>;
  let bonoService: BonoService;
  let claseService: ClaseService;

  const mockUsuario: UsuarioEntity = {
    id: 1,
    nombre: 'Camilo Escobar',
    extension: '12345678',
    grupoinvestigacion: 'TICS',
    rol: Role.PROFESOR,
    bonos: [],
    clases: [],
  } as unknown as UsuarioEntity;

  const mockUsuarioDto: UsuarioDto = {
    nombre: 'Jorge David',
    extension: 123456789,
    grupoinvestigacion: 'TICS',
    rol: Role.PROFESOR,
    cedula: '1234567890',
    jefeId: 1,
    BonosId: [1] as unknown as Long[],
    clasesId: [1] as unknown as Long[],
  };

  const mockRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockBonoService = {
    findOne: jest.fn(),
  };

  const mockClaseService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: getRepositoryToken(UsuarioEntity),
          useValue: mockRepository,
        },
        {
          provide: BonoService,
          useValue: mockBonoService,
        },
        {
          provide: ClaseService,
          useValue: mockClaseService,
        },
      ],
    }).compile();

    usuarioService = module.get<UsuarioService>(UsuarioService);
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    bonoService = module.get<BonoService>(BonoService);
    claseService = module.get<ClaseService>(ClaseService);
  });

  it('should be defined', () => {
    expect(usuarioService).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new usuario', async () => {
      mockBonoService.findOne.mockResolvedValue({});
      mockClaseService.findOne.mockResolvedValue({});
      mockRepository.save.mockResolvedValue(mockUsuario);

      const result = await usuarioService.create(mockUsuarioDto);

      expect(result).toEqual(mockUsuario);
      expect(mockBonoService.findOne).toHaveBeenCalledWith(1);
      expect(mockClaseService.findOne).toHaveBeenCalledWith(1);
      expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining(mockUsuarioDto));
    });

    it('should throw an error if grupoInvestigacion is invalid for profesor', async () => {
      const invalidUsuarioDto = { ...mockUsuarioDto, grupoinvestigacion: 'INVALID' };
      try {
        await usuarioService.create(invalidUsuarioDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe('The group is not valid');
      }
    });

    it('should throw an error if extension is invalid for non-profesor', async () => {
      const invalidUsuarioDto = {nombre: 'John Doe',
        extension: 123456789,
        grupoinvestigacion: 'TICS',
        rol: Role.ESTUDIANTE,
        cedula: '1234567890',
        jefeId: 1,
        BonosId: [1] as unknown as Long[],
        clasesId: [1] as unknown as Long[],};
      try {
        await usuarioService.create(invalidUsuarioDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe('The extension is not valid');
      }
    });

    it('should throw an error if a bono is not found', async () => {
      mockBonoService.findOne.mockResolvedValue(null);
      try {
        await usuarioService.create(mockUsuarioDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe('The bono with the given id was not found');
      }
    });

    it('should throw an error if a clase is not found', async () => {
      mockBonoService.findOne.mockResolvedValue({});
      mockClaseService.findOne.mockResolvedValue(null);
      try {
        await usuarioService.create(mockUsuarioDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe('The clase with the given id was not found');
      }
    });
  });

  describe('findOne', () => {
    it('should return a usuario when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockUsuario);

      const result = await usuarioService.findOne(1 as unknown as Long);

      expect(result).toEqual(mockUsuario);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['bonos', 'clases'],
      });
    });

    it('should throw an error if usuario is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      try {
        await usuarioService.findOne(1 as unknown as Long);
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe('The usuario with the given id was not found');
      }
    });
  });

  describe('delete', () => {
    it('should delete a usuario when conditions are met', async () => {
      const usuarioToDelete = { ...mockUsuario, bonos: [] };
      mockRepository.findOne.mockResolvedValue(usuarioToDelete);
      mockRepository.remove.mockResolvedValue(undefined);

      await usuarioService.delete(1 as unknown as Long);

      expect(mockRepository.remove).toHaveBeenCalledWith(usuarioToDelete);
    });

    it('should throw an error if usuario has bonos', async () => {
      const usuarioWithBonos = { ...mockUsuario, bonos: [{}] };
      mockRepository.findOne.mockResolvedValue(usuarioWithBonos);

      try {
        await usuarioService.delete(1 as unknown as Long);
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe("The usuario can't be deleted");
      }
    });

    it('should throw an error if usuario is decana', async () => {
      const usuarioDecana = { ...mockUsuario, rol: Role.DECANA };
      mockRepository.findOne.mockResolvedValue(usuarioDecana);

      try {
        await usuarioService.delete(1 as unknown as Long);
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe("The usuario can't be deleted");
      }
    });
  });
});
