import { Module } from '@nestjs/common';
import { BonoService } from './bono.service';
import { BonoController } from './bono.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonoEntity } from './bono.entity';
import { ClaseService } from '../clase/clase.service';
import { UsuarioService } from '../usuario/usuario.service';
import { ClaseEntity } from '../clase/clase.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';

@Module({
  providers: [BonoService, ClaseService, UsuarioService],
  controllers: [BonoController],
  exports:[BonoService],
  imports:[TypeOrmModule.forFeature([BonoEntity, ClaseEntity, UsuarioEntity])]
})
export class BonoModule {}