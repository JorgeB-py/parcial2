import { Module } from '@nestjs/common';
import { BonoService } from './bono.service';
import { BonoController } from './bono.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonoEntity } from './bono.entity';

@Module({
  providers: [BonoService],
  controllers: [BonoController],
  exports:[BonoService],
  imports:[TypeOrmModule.forFeature([BonoEntity])]
})
export class BonoModule {}