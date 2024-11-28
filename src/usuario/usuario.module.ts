import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity';

@Module({
  providers: [UsuarioService],
  controllers: [UsuarioController],
  imports:[TypeOrmModule.forFeature([UsuarioEntity])],
  exports:[UsuarioService]
})
export class UsuarioModule {}