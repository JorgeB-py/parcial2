import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { BonoService } from './bono.service';
import { Long } from 'typeorm';
import { BonoDto } from './bono.dto';


@UseInterceptors(BusinessErrorsInterceptor)
@Controller('bono')
export class BonoController {
    constructor(private readonly bonoService: BonoService,
        
    ) { }

    @Get()
    async findAll() {
        return await this.bonoService.findAll();
    }

    @Get(':bonoId')
    async findOne(@Param('bonoId') bonoId: Long) {
        return await this.bonoService.findOne(bonoId);
    }

    @Post()
    async create(@Body() bonoDto: BonoDto) {
        return await this.bonoService.create(bonoDto);
    }

    @Delete(':bonoId')
    @HttpCode(204)
    async delete(@Param('bonoId') bonoId: Long) {
        return await this.bonoService.delete(bonoId);
    }
}
