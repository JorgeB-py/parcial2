import { IsNotEmpty, isNumber, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { Long } from 'typeorm';

export class BonoDto {

    @IsNumber()
    @IsNotEmpty()
    monto: number;

    @IsNumber()
    @IsNotEmpty()
    calificacion: number;

    @IsString()
    @IsNotEmpty()
    palabraclave: string;

    @IsOptional()
    claseId: Long;

    @IsOptional()
    usuarioId: Long;
}