import { Module } from '@nestjs/common';
import { ClaseService } from './clase.service';
import { ClaseController } from './clase.controller';
import { ClaseEntity } from './clase.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [ClaseService],
  controllers: [ClaseController],
  imports:[TypeOrmModule.forFeature([ClaseEntity])],
  exports:[ClaseService]
})

export class ClaseModule {}
