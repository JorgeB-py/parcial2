import { IsArray, IsNotEmpty, isNumber, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { Long } from 'typeorm';

export class ClaseDto {

    @IsNumber()
    @IsNotEmpty()
    codigo: string;

    @IsNumber()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    numerocreditos: number;

    @IsOptional()
    @IsArray()
    BonosId: Long[];

    @IsOptional()
    usuarioId: Long;
}