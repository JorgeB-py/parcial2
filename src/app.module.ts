import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { BonoModule } from './bono/bono.module';
import { ClaseModule } from './clase/clase.module';

@Module({
  imports: [UsuarioModule, BonoModule, ClaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
